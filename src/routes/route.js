const express = require('express');
const router = express.Router();


const loginController = require("../controller/loginController")
const middleWare = require("../middleWare/auth")
const user = require("../controller/userController")
const post = require("../controller/postController")
const follow = require("../controller/followersController")
const comment = require("../controller/commentController")
const likes = require("../controller/likeController")









router.post("/api/follow/:userId/:followingID",middleWare.validateToken, follow.followers)

router.get("/Users/:userId", user.Getuser)

router.put("/api/unfollow/:userId/:followingID",middleWare.validateToken, follow.UnFollow)

router.post("/login", loginController.loginUser)

router.post("/api/posts", post.createPost)

router.post("/api/like/:userId/:likedID",middleWare.validateToken, likes.Like)

router.post("/api/unlike/:userId/:likedID",middleWare.validateToken, likes.unLike)


router.post("/api/comment/createComment",middleWare.validateToken, comment.createComment)

router.get("/post/:postId", post.GetPostById)

router.get("/Allpost/:userId", post.GetAllPost)

router.delete("/DeletePost/:postId/:userId",middleWare.validateToken, post.DeletePost)












module.exports = router;