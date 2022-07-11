const { BCRYPT_WORK_FACTOR } = require("../config")
const bcrypt = require("bcrypt")
const db = require("../db")
const { BadRequestError, UnauthorizedError } = require("../utils/errors")

class User {

    static makePublicUser(user) {
        return {
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
        }
    }

    static async login(credentials) {
        // User should submit email and pass
        // If either missing, throw error
        console.log(credentials)
        const requiredFields = ['email', 'password']
        requiredFields.forEach(field => {
            if (!credentials.hasOwnProperty(field)) {
                throw new BadRequestError(`Missing ${field} in request`)
            }
        })
        //  Lookup user in db by email
            const user = await User.fetchUserByEmail(credentials.email)
         // if user is found, compare passwords submitted with db
         // if match, return the user
         if (user) {
            const isValid = await bcrypt.compare(credentials.password, user.password)
            if (isValid) {
                return User.makePublicUser(user)
            }
         }

         // if any goes wrong, throw unauthorized error
         throw new UnauthorizedError("Invalid email/password combo")
    }

    static async register(credentials) {
        // user should submit email, password, rsvp status, and number of guests
        //if any are missing throw error
        const requiredFields = ["username", "password", "email", "first_name", "last_name"]
        requiredFields.forEach(field => {
            if (!credentials.hasOwnProperty(field)) {
                throw new BadRequestError("Missing " + field + " in request body.")
            }
        })

        // ensure no user exists with that email
        // if one does throw error
        const existingEmail = await User.fetchUserByEmail(credentials.email)
        if (existingEmail) {
            throw new BadRequestError("Duplicate email: " + credentials.email)
        }
        const existingUsername = await User.fetchUserByUsername(credentials.username)
        if (existingUsername) {
            throw new BadRequestError("Duplicate username: " + credentials.username)
        }

        // take users password and hash it
        const hashedPw = await bcrypt.hash(credentials.password, BCRYPT_WORK_FACTOR)
        // take the users email and lowercase it
        const lowercasedEmail = credentials.email.toLowerCase()

        // create a new user in DB with all their info
        const result = await db.query(`
            INSERT INTO users (
                username, 
                password,
                email,
                first_name,
                last_name
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, username, email, first_name, last_name, created_at;
        `,
        [credentials.username, hashedPw, lowercasedEmail, credentials.first_name, credentials.last_name]
        )
        // return the user
        const user = result.rows[0]
        return user
    }

    static async fetchUserByEmail(email) {
        if (!email) {
            throw new BadRequestError("No email provided")
        }

        const query = `SELECT * FROM users WHERE email = $1`

        const result = await db.query(query, [email.toLowerCase()])

        const user = result.rows[0]

        return user
    }

    static async fetchUserByUsername(username) {
        if (!username) {
            throw new BadRequestError("No username provided")
        }

        const query = `SELECT * FROM users WHERE username = $1`

        const result = await db.query(query, [username.toLowerCase()])

        const user = result.rows[0]

        return user
    }
}

module.exports = User