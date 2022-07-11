const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const authRoutes = require('./routes/auth')
const nutritionRoutes = require('./routes/nutrition')
const activivtyRoutes = require('./routes/activity')
// const postRoutes = require("./routes/posts")

const { NotFoundError } = require("./utils/errors")
const security = require("./middleware/security")

const app = express()

// enables cross-origin resource sharing for all origins
app.use(cors())
//parse incoming request bodies with JSON payload
app.use(express.json())
//tag request info
app.use(morgan("tiny"))
// Makes sure for every request, make sure a user or token exists in the authorization header
// If it does, attach the decoded user to res.locals
app.use(security.extractUserFromJwt)

app.use("/auth", authRoutes)
app.use("/nutrition", nutritionRoutes)
app.use("/activity", activivtyRoutes)
// app.use("/posts", postRoutes)

app.get("/", (req, res) => {
    res.status(200).send({ "ping": "pong" })
})

// 404 Not Found Middleware
app.use((req, res, next) => {
    return next(new NotFoundError())
})

app.use((err, req, res, next) => {
    const status = err.status || 500
    const message = err.message
    return res.status(status).json({
        error: { message, status}
    })
})


module.exports = app 