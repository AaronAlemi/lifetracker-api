const { BCRYPT_WORK_FACTOR } = require("../config")
const bcrypt = require("bcrypt")
const db = require("../db")
const { BadRequestError, UnauthorizedError } = require("../utils/errors")

class Nutrition {
    static async createNutrition({ user, nutrition }) {
        const requiredFields = ["name", "category", "calories", "imageUrl", "quantity"]
        requiredFields.forEach((field) => {
          if (!nutrition?.hasOwnProperty(field)) {
            throw new BadRequestError(`Missing required field - ${field} - in request body.`)
          }
        })
        console.log("user email: " + user.email)
    
        const results = await db.query(
          `
            INSERT INTO nutrition (name, category, calories, image_url, quantity, user_id)
            VALUES ($1, $2, $3, $4, $5, (SELECT id FROM users WHERE email = $6))
            RETURNING id, name, category, calories, image_url, quantity, user_id, created_at 
          `,
          [
            nutrition.name,
            nutrition.category,
            nutrition.calories,
            nutrition.imageUrl,
            nutrition.quantity,
            user.email
          ]
        )
    
        return results.rows[0]
      }

      static async listNutritionForUser({user}) {
        const results = await db.query(
            `
                SELECT  nutrition.id,
                        nutrition.name,
                        nutrition.category,
                        nutrition.calories,
                        nutrition.image_url,
                        nutrition.quantity,
                        SUBSTRING (cast(nutrition.created_at AS TEXT), 1, 10) as date,
                        nutrition.created_at,
                        users.email
                FROM    nutrition
                    LEFT JOIN users ON users.id = nutrition.user_id
                WHERE   users.email = $1
                ORDER BY nutrition.created_at DESC
            `, [user.email]
        )

        return results.rows
      }
}

module.exports = Nutrition