const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware/auth");
const Photo = require("../db/photoModel");

const route = express.Router();

router.post("/commentsOfPhoto/:photo_id", async (req, res) => {
    try {
        const photoId = req.params.photo_id;
        const comment = req.body.comment;
        const userId = req.user._id;

        const photo = await Photo.findById(photoId);
        if (!photo) {
            return res.status(400).send("Photo not found");
        }
        photo.comments.push({
            comment,
            user_id: userId,
            date_time: new Date()
        });
        await photo.save();
        res.status(200).json({
            errCode: 0,
            message: "Comment added successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;