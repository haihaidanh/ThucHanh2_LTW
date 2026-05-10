const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateAccessToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1h",
        }
    );
};

const generateRefreshToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
        }
    );
};

const refreshToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET,
            async (err, data) => {
                if (err) {
                    return resolve({
                        success: false,
                        message: "Invalid refresh token",
                    });
                }

                const accessToken = generateAccessToken({
                    _id: data._id,
                    last_name: data.last_name,
                });

                resolve({
                    success: true,
                    accessToken,
                });
            }
        );
    });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    refreshToken,
};