const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const followersSchema = new mongoose.Schema(
    {
        userId: {
            required: true,
            type: ObjectId,
            ref: 'User'
        },
        followingID: {
            required: true,
            type: ObjectId,
            ref: 'User'
        },
        isDeleted: {
            type: Boolean,
            default: false

        }

    },
    { timestamps: true }
);

module.exports = mongoose.model("follower", followersSchema);