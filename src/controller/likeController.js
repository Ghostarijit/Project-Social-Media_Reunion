const userModel = require("../model/userModel")
const likeModel = require("../model/likeModel")
const postModel = require("../model/postModel")


const Like = async (req, res) => {
    try {
        let userId = req.params.userId
        let likedID = req.params.likedID

        let Follow = await userModel.findById(userId)
        let Following = await userModel.findById(likedID)

        // accessing the payload authorId from request
        let token = req["userId"]

        // authorization
        if (token != userId) {
            return res.status(403).send({ status: false, msg: "You are not authorized to access this data" })
        }


        let arr = []
        let create = await likeModel.create({ userId: userId, likedID: likedID })
        let find = await likeModel.find({ likedID: likedID, isDeleted: false }).count()

        let check = await likeModel.find({ likedID: likedID, isDeleted: false })

        for (let i = 0; i < check.length; i++) {

            let user = await userModel.findOne({ _id: check[i].userId, isDeleted: false }).select({ username: 1 })

            arr.push(JSON.parse(JSON.stringify(user)))
        }

        let use = await postModel.findByIdAndUpdate({ _id: likedID, isDeleted: false }, {

            $set: { likes: find }

        }, { new: true })

        let Doc = {
            post: use,
            likedPreson: arr

        }
        return res.status(201).send({ status: true, data: Doc })

    } catch (err) {
        res.status(500).send({ status: "error", msg: err.message })
    }

}




const unLike = async (req, res) => {
    try {
        let userId = req.params.userId
        let likedID = req.params.likedID

        let Follow = await userModel.findById(userId)
        let Following = await userModel.findById(likedID)


        // accessing the payload authorId from request
        let token = req["userId"]

        // authorization
        if (token != userId) {
            return res.status(403).send({ status: false, msg: "You are not authorized to access this data" })
        }
        let use = await likeModel.findOneAndUpdate({ userId: userId, likedID: likedID }, {

            $set: { isDeleted: true }

        }, { new: true })

        let post = await postModel.findOne({ _id: likedID })

        let check = await userModel.findById(post.userId)
        return res.status(201).send({ status: true, data: `You UnLike ${post._id} Post and the user is : ${check.username}` })

    } catch (err) {
        res.status(500).send({ status: "error", msg: err.message })
    }

}



module.exports.Like = Like

module.exports.unLike = unLike

