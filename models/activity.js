const { BCRYPT_WORK_FACTOR } = require("../config")
const bcrypt = require("bcrypt")
const db = require("../db")
const { BadRequestError, UnauthorizedError } = require("../utils/errors")

class Activity {
    static async getAverageCaloriesPerCategoryForUser({user}) {
        const results = await db.query(
            `
                SELECT category, ROUND (AVG(calories), 1)
                FROM nutrition
                    LEFT JOIN users ON nutrition.user_id = users.id
                WHERE
                    users.email = $1
                GROUP BY category

            `, [user.email]
        )

        return results.rows
    }

    /*
      Count calories averaged rounded to 1 decimal, pull from nutrition
                left join with users table wrap the users id

                For where, match the users email

                Then group by category
    */

    static async getTotalCaloriesPerDayForUser({user}) {
        const results = await db.query(
            `
                SELECT SUBSTRING (cast(nutrition.created_at AS TEXT), 1, 10) as date, 
                        SUM(nutrition.calories) AS totalCaloriesPerDay
                FROM nutrition
                    LEFT JOIN users ON users.id = nutrition.user_id
                WHERE users.email = $1
                GROUP BY date


            `, [user.email]
        )

        return results.rows
    }

    /*

    SELECT SUM(calories)
                FROM nutrition
                    LEFT JOIN users ON nutrition.user_id = users.id
                WHERE users.email = $1
                GROUP BY SUBSTRING (cast(nutrition.created_at AS TEXT), 1, 10)

    */


}


module.exports = Activity