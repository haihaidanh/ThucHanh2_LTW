const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../db/userModel");
const jwt = require("jsonwebtoken");
const { refreshToken, generateAccessToken, generateRefreshToken } = require("../jwt/JwtService");
require("dotenv").config();

router.post("/admin/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(400).send("Invalid username or password");
        }
        const accessToken = await generateAccessToken({
            _id: user._id,
            last_name: user.last_name,
        });

        const refreshToken = await generateRefreshToken({
            _id: user._id,
            last_name: user.last_name,
        });

        res.status(200).json({
            errCode: 0,
            last_name: user.last_name,
            accessToken,
            refreshToken,
            userId: user._id,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ errCode: 1 });
    }
});

router.post("/admin/logout", (req, res) => {
    res.status(200).json({ message: "Logged out successfully" });
});

router.post("/admin/refresh-token", async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: "No token provided" });
    }

    const tk = await refreshToken(token);
    if (!tk.success) {
        return res.status(403).json({ message: tk.message });
    }
    res.status(200).json({ accessToken: tk.accessToken });
});

router.post("/admin/register", async (req, res) => {
    try {
        const { first_name, last_name, location, description, occupation, username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                errCode: 2,
                message: "Username already exists"
            });
        }
        const newUser = new User({
            first_name,
            last_name,
            location,
            description,
            occupation,
            username,
            password,
        });
        await newUser.save();
        res.status(200).json({
            errCode: 0,
            message: "User registered successfully"
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            errCode: 1,
            message: "Error registering user"
        });
    }
});

module.exports = router;