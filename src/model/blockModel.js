const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const blockSchema = new mongoose.Schema(
    {
        userId: {
            required: true,
            type: ObjectId,
            ref: 'User'
        },
        user_blockingId: {
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

module.exports = mongoose.model("block", blockSchema);