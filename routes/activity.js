const express = require("express")
const Activity = require("../models/activity")
const { createUserJwt } = require("../utils/tokens")
const router = express.Router()
const security = require("../middleware/security")

router.get("/", security.requiredAuthenticatedUser, async (req, res, next) => {
    try {
        const user = res.locals.user
        console.log(user)
        const caloriesPerCategory = await Activity.getAverageCaloriesPerCategoryForUser({user})
        const caloriesPerDay = await Activity.getTotalCaloriesPerDayForUser({user})
        console.log(caloriesPerCategory, caloriesPerDay)
        return res.status(200).json({caloriesPerCategory, caloriesPerDay})
    } catch(error) {
        next(error)
    }
})



module.exports = router