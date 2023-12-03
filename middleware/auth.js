import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function authenticate(req, res, next) {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler(401, "Please login to access resources"));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findByPk(decodedData.id);
  if (!user) {
    return next(new ErrorHandler(404, "User not found"));
  }
  req.user = user;
  next();
}
