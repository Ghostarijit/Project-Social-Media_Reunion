const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const commentSchema = new mongoose.Schema(
    {
        postId: {
            required: true,
            type: ObjectId,
            ref: 'Post'
        },
        userId: {
            required: true,
            type: ObjectId,
            ref: 'User'
        },
        comment: {
            type: String

        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("comment", commentSchema);