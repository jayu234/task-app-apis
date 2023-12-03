import catchAcyncError from "../middleware/catchAcyncError.js";
import User from "../models/User.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import sendToken from "../utils/sendJwtToken.js";

const passRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#._%@])[A-Za-z\d!#._%@]{8,}$/;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler(400, "Please provide all the credentials"));
  }

  const isValidEmail = emailRegex.test(email);
  if (!isValidEmail) {
    return next(new ErrorHandler(400, "Please provide valid email."));
  }

  const isExisting = await User.findOne({ where: { email: email } });
  if (isExisting) {
    return next(new ErrorHandler(400, "User already exist."));
  }

  const isValidPwd = passRegex.test(password);
  if (!isValidPwd) {
    return next(
      new ErrorHandler(
        400,
        "Invalid password. Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 digit, 1 symbol from !, #, ., _, @,or %, and have a minimum length of 8 characters."
      )
    );
  }

  const newUser = await User.create(req.body);
  if (!newUser) {
    return next(new ErrorHandler(500, "Falied to create user."));
  }
  sendToken(newUser, res, 201, "Registered successfully!");
};

export const login = catchAcyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler(400, "Enter email and password."));
  }

  const user = await User.findOne({ where: { email: email } });

  if (!user) {
    return next(new ErrorHandler(401, "Invalid email or password."));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler(401, "Invalid email or password"));
  }

  sendToken(user, res, 200, "Logged in successfully!");
});

export const logout = catchAcyncError(async (req, res, next) => {
  res.clearCookie("token", {
    expires: new Date(Date.now()),
    secure: process.env.NODE_ENV === "development" ? false : true,
    httpOnly: process.env.NODE_ENV === "development" ? false : true,
    sameSite: process.env.NODE_ENV === "development" ? false : "none",
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
