const jwt = require("jsonwebtoken")
const {SECRET_KEY} = require("../config")
const { UnauthorizedError } = require("../utils/errors")

//create function to extract JWT from the request header
const jwtForm = ({ headers }) => {
    if (headers?.authorization) {
        const [scheme, token] = headers.authorization.split(" ")
        if (scheme.trim() === "Bearer") {
            return token
        }
    }

    return undefined
}

// create function to attach user to res object
const extractUserFromJwt = (req, res, next) => {
    try {
        const token = jwtForm(req)
        if(token) {
            res.locals.user = jwt.verify(token, SECRET_KEY)
        }

        return next()

    } catch (error) {
        return next()
    }
}

// create a function to verify a authed user exists
const requiredAuthenticatedUser = (req, res, next) => {
    try {
        const { user } = res.locals
        if (!user?.email) {
            throw new UnauthorizedError()
        }
        return next()
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    requiredAuthenticatedUser,
    extractUserFromJwt

}