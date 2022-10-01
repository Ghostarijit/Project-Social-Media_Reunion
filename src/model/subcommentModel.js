const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const subcommentSchema = new mongoose.Schema(
    {
        commentId: {
            required: true,
            type: ObjectId,
            ref: 'comment'
        },
        userId: {
            required: true,
            type: ObjectId,
            ref: 'User'
        },
        subcomment:{
            type:String,
            required:true
        },
        isDeleted: {
            type: Boolean,
            default: false

        }

    },
    { timestamps: true }
);

module.exports = mongoose.model("subcomment", subcommentSchema)