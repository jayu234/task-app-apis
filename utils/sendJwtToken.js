const sendToken = (user, res, statusCode, message) => {
    const token = user.getJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        secure: process.env.NODE_ENV === "development" ? false : true,
        httpOnly: process.env.NODE_ENV === "development" ? false : true,
        sameSite: process.env.NODE_ENV === "development" ? false : "none",
        path: '/'
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        message: message,
    });
}

export default sendToken;