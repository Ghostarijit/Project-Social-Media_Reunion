const userModel = require("../model/userModel")
const postModel = require("../model/postModel")
const commentModel = require("../model/commentModel")
const subcommentModel = require("../model/subcommentModel")





const createsubComment = async function (req, res) {
    try {
        const data = req.body
        //  data validation  

        if (!data || Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "plz enter some data" })

        let { commentId, userId, subcomment, isDeleted } = data


        // accessing the payload authorId from request
        let token = req["userId"]

        // authorization
        if (token != userId) {
            return res.status(403).send({ status: false, msg: "You are not authorized to access this data" })
        }
       

        let com = await commentModel.findById(commentId)
        
        let post = await postModel.findById(com.postId)

        let allcomment = await commentModel.find({postId:com.postId})

        let subcommentt = await subcommentModel.create(data)

        let Doc = {
            post: post,
            AllComment:allcomment,
            Comment:{
                subcomment:subcommentt
            }
        }


        return res.status(201).send({ status: true, data: Doc })



    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}








module.exports.createsubComment = createsubComment