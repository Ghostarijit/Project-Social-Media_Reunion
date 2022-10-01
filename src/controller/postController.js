const mongoose = require('mongoose');
const userModel = require("../model/userModel")
const postModel = require("../model/postModel")
const commentModel = require("../model/commentModel")
const likeModel = require("../model/likeModel")
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
            // console.log(data)
            // console.log("file uploaded succesfully")
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

        let { userId, postId, desc, img, video, text, frindtag, hashtag, title, isDeleted } = data



        let frindtags = frindtag.split(",")

        const subtrim = frindtags.map(element => {
            return element.trim()

        })

        let save = []

        for(let i=0;i<subtrim.length;i++){
            let user = await userModel.findById(subtrim[i])
            save.push(user.username)
        }
        
        data.frindtag = save
        data.hashtag = hashtag.split(",")

        var arr = []
        var arr1 = []
        let files = req.files
        for (let j = 0; j < files.length; j++) {
            if ((/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(files[j].originalname)) {
                let uploadedFileURL = await uploadFile(files[j])

                arr.push(uploadedFileURL)
            }
            else if ((/\.(mp4|mkv|webm|avi)$/i).test(files[j].originalname)) {
                let uploadedFile = await uploadFile(files[j])
                arr1.push(uploadedFile)
            }
        }

        data.img = arr
        data.video = arr1


        let post = await postModel.create(data)


        return res.status(201).send({ status: true, data: post })



    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}

const updatePost = async function (req, res) {
    try {
        const data = req.body
        //  data validation  

        if (!data || Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "plz enter some data" })

        let { userId, postId, desc, img,text, frindtag, hashtag, video } = data


        let user = await userModel.findById(userId)
        let token = req["userId"]

        // authorization
        if (token != userId) {
            return res.status(403).send({ status: false, msg: "You are not authorized to access this data" })
        }



        let files = req.files
        for (let j = 0; j < files.length; j++) {
            if ((/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(files[j].originalname)) {
                var uploadedFileURL = await uploadFile(files[j])


            }
            else if ((/\.(mp4|mkv|webm|avi)$/i).test(files[j].originalname)) {
                var uploadedFile = await uploadFile(files[j])

            }
        }


        const updatepost = await postModel.findOneAndUpdate({ _id: postId?.trim(), userId: userId }, {

            $addToSet: { img: uploadedFileURL, video: uploadedFile,frindtag:frindtag,hashtag:hashtag },

            $set: { desc: desc ,text:text}

        }, { new: true })





        return res.status(201).send({ status: true, data: `your post is successfully upadted,post is ${updatepost}` })



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





        let up = await postModel.find({ userId: userId, isDeleted: false })










        return res.status(201).send({ status: true, data: up })



    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}


const GetAllPostWitchILiked = async function (req, res) {
    try {
        const userId = req.params.userId
        //  data validation  







        var arr = []

        let up = await likeModel.find({ userId: userId, isDeleted: false })

        for (let i = 0; i < up.length; i++) {


            let post = await postModel.findOne({ _id: Pup[i].postId })

            if (post.userId != userId) {
                arr.push(post)
            }

        }



        return res.status(201).send({ status: true, data: `All post you liked Except your's ${arr}` })



    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}



const DeletePost = async function (req, res) {
    try {
        const postId = req.params.postId
        const userId = req.params.userId
        //  data validation  





        let up = await postModel.findOneAndUpdate({ _id: postId, userId: userId }, {

            $set: { isDeleted: true }

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

const GetPostEvery5Sec = async function (req, res) {
    try {

        const userId = req.params.userId


        let token = req["userId"]

        // authorization
        if (token != userId) {
            return res.status(403).send({ status: false, msg: "You are not authorized to access this data" })
        }


        let post = await postModel.find().sort({ createdAt: 1 }).limit(10)

        setInterval(() => {

            res.status(201).send({ status: true, data: post })

        }, 5000)


    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}



module.exports.createPost = createPost

module.exports.GetPostById = GetPostById

module.exports.GetAllPost = GetAllPost

module.exports.DeletePost = DeletePost

module.exports.GetAllPostWitchILiked = GetAllPostWitchILiked

module.exports.updatePost = updatePost

module.exports.GetPostEvery5Sec = GetPostEvery5Sec

