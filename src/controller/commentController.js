const userModel = require("../model/userModel")
const postModel = require("../model/postModel")
const commentModel = require("../model/commentModel")




const createComment = async function (req, res) {
    try {
        const data = req.body
        //  data validation  

        if (!data || Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "plz enter some data" })

        let { userId, postId, comment, isDeleted } = data


        // accessing the payload authorId from request
        let token = req["userId"]

        // authorization
        if (token != userId) {
            return res.status(403).send({ status: false, msg: "You are not authorized to access this data" })
        }
        let up = await postModel.findOneAndUpdate({ _id: postId }, {

            $addToSet: { Comment: comment }

        }, { new: true })


        let user = await commentModel.create(data)


        return res.status(201).send({ status: true, data: up })



    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}








module.exports.createComment = createComment