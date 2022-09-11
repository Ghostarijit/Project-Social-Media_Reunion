const { resetWatchers } = require("nodemon/lib/monitor/watch")
const userModel = require("../model/userModel")
const aws = require("aws-sdk")
const followersModel = require("../model/followersModel")
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




const createuser = async (req, res) => {
    try {
        let data = JSON.parse(JSON.stringify(req.body))
        //  data validation

        let { username, profilePicture, coverPicture, email, password, followers, followings, isAdmin, desc, city, from, relationship, isDeleted } = data


        if (data === undefined || Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "plz enter some data" })

        // name validation
        // console.log(typeof name)
        if (!username || username === undefined) return res.status(400).send({ status: false, msg: "first name must be present" });
        if (typeof username !== "string" || username.trim().length === 0) return res.status(400).send({ status: false, msg: "fname should be string" });

        let nname = /^[a-zA-Z ]{2,30}$/.test(username.trim())
        if (!nname) return res.status(400).send({ status: false, msg: "enter valid  name" })

        data.username = data.username.trim()

        if (!username || username === undefined) return res.status(400).send({ status: false, msg: "first name must be present" });
        if (typeof username !== "string" || username.trim().length === 0) return res.status(400).send({ status: false, msg: "fname should be string" });

        let cityy = /^[a-zA-Z ]{2,30}$/.test(city.trim())
        if (!cityy) return res.status(400).send({ status: false, msg: "enter valid  name of city" })

        data.city = data.city.trim()


        // title validation
        if (!relationship) return res.status(400).send({ status: false, msg: "relationship must be present" });
        if (typeof relationship !== "string") return res.status(400).send({ status: false, msg: "relationship should be string" });
        if (!(["Single", "complicated", "married"].includes(data.relationship.trim()))) return res.status(400).send({ status: false, msg: "plz write valid relationship" })
        data.relationship = data.relationship.trim()
        // email validation
        if (!email) {
            return res.status(400).send({ status: false, msg: "email must be present" });
        }
        if (typeof email != "string")
            return res.status(400).send({ status: false, message: "Email must be in String datatype" })
        let regx = /^([a-zA-Z0-9\._]+)@([a-zA-Z])+\.([a-z]+)(.[a-z])?$/

        let x = regx.test(email.trim())
        if (!x) {
            return res.status(400).send({ status: false, msg: "write the correct format for email" })
        }
        let mail = await userModel.findOne({ email: email.trim().toLowerCase() })

        if (mail) return res.status(400).send({ status: false, msg: "this email is already present" })
        data.email = data.email.trim().toLowerCase()

        // password validation
        if (!password) return res.status(400).send({ status: false, msg: "plz write the password" });
        if (typeof password !== "string" || password.trim().length === 0) return res.status(400).send({ status: false, msg: "enter valid password" });

        let pass = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#\$%\^&\*])(?=.*[A-Z]).{8,15}$/.test(password.trim())

        if (!pass) return res.status(400).send({ status: false, msg: "1.At least one digit, 2.At least one lowercase character,3.At least one uppercase character,4.At least one special character, 5. At least 8 characters in length, but no more than 16" })
        data.password = data.password.trim()


        let files = req.files

        let uploadedFileURL = await uploadFile(files[0])
        data.profilePicture = uploadedFileURL




        let uploadedFile = await uploadFile(files[1])
        data.coverPicture = uploadedFile


        let user = await userModel.create(data)

        return res.status(201).send({ status: true, data: user })
    } catch (err) {
        res.status(500).send({ status: "error", msg: err.message })
    }
}


const Getuser = async (req, res) => {
    try {
        let Id = req.params.userId


        let foll = await followersModel.find({ followingID: Id, isDeleted: false }).count()
        let fol = await followersModel.find({ followingID: Id, isDeleted: false })

        


        let arr1 = []
        let arr2 =[]

        for (let i = 0; i < fol.length; i++) {
            let find = await userModel.findOne({ _id: fol[i].userId }).select({ username: 1 })

            arr1.push(JSON.parse(JSON.stringify(find)))


        }

        let userr = await userModel.findByIdAndUpdate({ _id: Id, isDeleted: false }, {

            $set: { followers: foll }

        }, { new: true })

        


        let folll = await followersModel.find({userId:Id,isDeleted:false})
        let fo = await followersModel.find({userId:Id,isDeleted:false}).count()


        let use = await userModel.findByIdAndUpdate({ _id: Id, isDeleted: false }, {

            $set: { followings: fo }

        }, { new: true })

        for (let i = 0; i < folll.length; i++) {
            
            let Follow = await userModel.findOne({_id:folll[i].followingID}).select({username:1})

            arr2.push(JSON.parse(JSON.stringify(Follow)))


        }
          let following = await followersModel.find({userId:Id})


        let Doc = {

            User: userr,
            followers: arr1,
            followings:arr2


        }

        return res.status(201).send({ status: true, data: Doc })




    } catch (err) {
        res.status(500).send({ status: "error", msg: err.message })
    }
}


module.exports.createuser = createuser
module.exports.Getuser = Getuser

