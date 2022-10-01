const userModel = require("../model/userModel")
const likeModel = require("../model/likeModel")
const postModel = require("../model/postModel")
const blockModel = require("../model/blockModel")

const blockUser = async function (req, res) {
    try {
        const userId = req.params.userId
        const user_blockingId = req.params.user_blockingId



        let blocked = await blockModel.create({ userId: userId, user_blockingId: user_blockingId })
        let user = await userModel.findById(user_blockingId)





        return res.status(201).send({ status: true, msg: `You Blocked ${user.username}` })



    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}

const unblockUser = async function (req, res) {
    try {
        const userId = req.params.userId
        const user_blockingId = req.params.user_blockingId  



        let user = await userModel.findById(user_blockingId)   // I dont use Aggreate we can use $lookup also for two database connected for same filed

        let use = await postModel.findByIdAndUpdate({ userId: userId, user_blockingId: user_blockingId, isDeleted: false }, {

            $set: { isDeleted: false }

        }, { new: true })



        return res.status(201).send({ status: true, msg: `You UnBlocked ${user.username}` })



    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}



module.exports.blockUser = blockUser

module.exports.unblockUser = unblockUser

