const mongoose = require('mongoose');
const userModel = require("../model/userModel")
const postModel = require("../model/postModel")
const commentModel = require("../model/commentModel")
const aws = require("aws-sdk")
//const followersModel = require("../model/followersModel")
aws.config.update({
    accessKeyId: "AKIAY3L35MCRUJ6WPO6J",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        // this function will upload file to aws and return the link
        let s3 = new aws.S3({ apiVersion: '2006-03-01' }); // we will be using the s3 service of aws

        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",  //HERE
            Key: "abc/" + file.originalname, //HERE 
            Body: file.buffer
        }


        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            console.log(data)
            console.log("file uploaded succesfully")
            return resolve(data.Location)
        })

        // let data= await s3.upload( uploadParams)
        // if( data) return data.Location
        // else return "there is an error"

    })
}



const createPost = async function (req, res) {
    try {
        const data = req.body
        //  data validation  

        if (!data || Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "plz enter some data" })

        let { userId, desc, img, likes, title, isDeleted } = data


        let user = await userModel.findById(userId)
        let token = req["userId"]

        // authorization
        if (token != userId) {
            return res.status(403).send({ status: false, msg: "You are not authorized to access this data" })
        }



        let files = req.files

        let uploadedFileURL = await uploadFile(files[0])
        data.img = uploadedFileURL


        let post = await postModel.create(data)





        return res.status(201).send({ status: true, data: post })



    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}



const GetPostById = async function (req, res) {
    try {
        const postId = req.params.postId
        //  data validation  





        let up = await postModel.findOne({ _id: postId, isDeleted: false })


        let user = await commentModel.find({ postId: postId, isDeleted: false }).count()

        
        let Doc = {
            post: up,
            commentNo: user
        }





        return res.status(201).send({ status: true, data: Doc })



    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}





const GetAllPost = async function (req, res) {
    try {
        const userId = req.params.userId
        //  data validation  


        


        let up = await postModel.find({userId: userId, isDeleted: false })



         

       




        return res.status(201).send({ status: true, data: up })



    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}




const DeletePost = async function (req, res) {
    try {
        const postId = req.params.postId
        const userId = req.params.userId
        //  data validation  





        let up = await postModel.findOneAndUpdate({_id:postId,userId:userId}, {

            $set: { isDeleted: true}

        }, { new: true })



        let token = req["userId"]

        // authorization
        if (token != userId) {
         return res.status(403).send({ status: false, msg: "You are not authorized to access this data" })
        }

       




        return res.status(201).send({ status: true, data: `post Deleted Successfully postId is :${postId}` })



    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}




module.exports.createPost = createPost

module.exports.GetPostById = GetPostById

module.exports.GetAllPost = GetAllPost

module.exports.DeletePost = DeletePost

