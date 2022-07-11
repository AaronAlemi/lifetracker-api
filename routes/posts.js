/* const express = require("express")
//const Post = require("../models/post")
const security = require("../middleware/security")
const router = express.Router()

router.post("/",  security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        // create a new post
       // const {user} = res.localsconst.post
    } catch (error) {
        next(error)
    }
})

router.get("/", async (req, res, next) => {
    try {

    } catch (error) {
        next(error)
    }
})

router.get("/:postId", async (req, res, next) => {
    try {

    } catch (error) {
        next(error)
    }
}) */

