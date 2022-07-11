const express = require("express")
const Nutrition = require("../models/nutrition")
const { createUserJwt } = require("../utils/tokens")
const router = express.Router()
const security = require("../middleware/security")

router.get("/", security.requiredAuthenticatedUser, async (req, res, next) => {
    try {
        const user = res.locals.user
        console.log(user)
        const nutrition = await Nutrition.listNutritionForUser({user})
        console.log(nutrition)
        return res.status(200).json({nutrition})
    } catch(error) {
        next(error)
    }
})

router.post("/create", security.requiredAuthenticatedUser, async (req, res, next) => {
    try {
        const user = res.locals.user
        console.log(user)
        const nutrition = await Nutrition.createNutrition({user, nutrition: req.body})
        return res.status(201).json({nutrition})
    } catch (error) {
        next(error)
    }
})

module.exports = router