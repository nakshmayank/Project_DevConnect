//send review 
//edit review 
//delete review

const express = require("express");
const reviewRouter = express.Router();
const { Review } = require("../model/reviews");
const { userAuth } = require("../middleware/userAuth");


//=====================create Review ===========================================

reviewRouter.post("/review", userAuth, async (req, res) => {
    try {
        const fromUserIdAuthorized = req.user._id;
        const { toUserId, comment, rating } = req.body;
        console.log(toUserId);

        if (fromUserIdAuthorized.toString() === toUserId.toString()) {
            return res.status(400).json({ message: "You cannot review yourself" });
        }

        const oldReview = await Review.findOne({
            toUserId: toUserId,
            fromUserId: fromUserIdAuthorized,
        });

        if (oldReview) {
            return res.status(400).json({
                message: "You have already reviewed this user",
            });
        }

        const review = await new Review({
            fromUserId: fromUserIdAuthorized,
            toUserId,
            comment,
            rating
        }).populate("fromUserId", ["name", "age", "photoUrl"]);
        await review.save();
        res.status(201).json({ message: "Review Created Successfully", data: review });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//================================edit review=============================


reviewRouter.patch("/review/:reviewId", userAuth, async (req, res) => {

    try {
        const fromUserId = req.user._id;
        const { reviewId } = req.params;
        // const toUserId = req.params.toUserId;

        const review = await Review.findOne({ _id: reviewId });
        if (!review) {
            return res.status(404).json({
                message: "No review exists to edit",
            });
        }

        if (review.fromUserId.toString() !== fromUserId.toString()) {
            return res.status(403).json({
                message: "Not allowed to edit this review",
            });
        }

        const { comment, rating } = req.body;

        const editedReview = await Review.findOneAndUpdate({ _id: reviewId }, { $set: { comment: comment, rating: rating } }, { new: true })
            .populate("fromUserId", ["name", "age", "photoUrl"]);
        res.send({ message: "This comment has been successfully edited", data: editedReview });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
})




//=============================delete review============================================

reviewRouter.delete("/review/:id", userAuth, async (req, res) => {
    try {
        const reviewId = req.params.id;

        const deletedReview = await Review.findOneAndDelete({ _id: reviewId, fromUserId: req.user._id });
        if (!deletedReview) {
            return res.status(404).json({
                message: "No such review exists",
            });
        }
        res.status(201).json({ message: "comment deleted successfully", data: deletedReview });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
})

module.exports = { reviewRouter };
