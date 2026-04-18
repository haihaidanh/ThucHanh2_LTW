const express = require("express");
const User = require("../db/userModel");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/user/list", async (req, res) => {
    try {
        const users = await User.find({}, "first_name last_name");

        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.get("/user/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send("Invalid user id");
        }

        const user = await User.findById(
            userId
        );

        if (!user) {
            return res.status(400).send("User not found");
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;