const followersModel = require("../model/followersModel")

const userModel = require("../model/userModel")


const followers = async (req, res) => {
    try {
        let userId = req.params.userId
        let followingID = req.params.followingID

        let Follow = await userModel.findById(userId)
        let Following = await userModel.findById(followingID)



        let token = req["userId"]

        // authorization
        if (token != userId) {
            return res.status(403).send({ status: false, msg: "You are not authorized to access this data" })
        }

        let create = await followersModel.create({ userId: userId, followingID: followingID })
        return res.status(201).send({ status: true, data: create })

    } catch (err) {
        res.status(500).send({ status: "error", msg: err.message })
    }

}



const UnFollow = async (req, res) => {
    try {
        let userId = req.params.userId
        let followingID = req.params.followingID




        let Follow = await userModel.findById(userId)
        let Follo = await userModel.findById(followingID)


        let token = req["userId"]

        // authorization
        if (token != userId) {
            return res.status(403).send({ status: false, msg: "You are not authorized to access this data" })
        }




        let unfollow = await followersModel.findOneAndUpdate({ userId: Follow._id, followingID: Follo._id }, {

            $set: { isDeleted: true }

        }, { new: true })


        let Following = await userModel.findOne({ _id: followingID })
        return res.status(201).send({ status: true, msg: `You UnFollowed ${Following.username}` })

    } catch (err) {
        res.status(500).send({ status: "error", msg: err.message })
    }

}


module.exports.followers = followers

module.exports.UnFollow = UnFollow

