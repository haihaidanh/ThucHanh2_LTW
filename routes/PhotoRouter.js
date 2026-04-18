const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../db/userModel");

router.get("/photosOfUser/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send("Invalid user id");
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).send("User not found");
        }
        const photos = await Photo.find({ user_id: userId });
        const result = await Promise.all(
            photos.map(async (photo) => {
                const comments = await Promise.all(
                    photo.comments.map(async (cmt) => {
                        const commentUser = await User.findById(
                            cmt.user_id,
                            "_id first_name last_name"
                        );

                        return {
                            _id: cmt._id,
                            comment: cmt.comment,
                            date_time: cmt.date_time,
                            user: commentUser,
                        };
                    })
                );
                return {
                    _id: photo._id,
                    user_id: photo.user_id,
                    file_name: photo.file_name,
                    date_time: photo.date_time,
                    comments: comments,
                };
            })
        );

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});


module.exports = router;
