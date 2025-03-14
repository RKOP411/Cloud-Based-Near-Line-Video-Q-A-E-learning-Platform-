var express = require('express');
var router = express.Router();
const { connectToDB } = require('../util/db');
const cors = require('cors')
const app = express();
app.use(cors());

router.get('/GetCourses/:userId', async function (req, res, next) {
    try {
        const connection = await connectToDB();
        const userId = req.params.userId; // Get the UserID from the URL parameter

        const sql = `SELECT * FROM Course WHERE UserID = ?`;

        connection.query(sql, [userId], (err, results) => {
            if (err) {
                console.error('Error retrieving courses:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.status(200).json(results);
        });

        // Close the connection
        connection.end();

    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});

router.get('/GetTop5Asking/:userId/:courseId', async (req, res) => {
    const { userId, courseId } = req.params;
    const connection = await connectToDB();
    const sql = `
        WITH Engagement AS (
            SELECT
                COUNT(DISTINCT q.QueueListID) AS joined_count,  -- Count distinct QueueListID joined by the user
                (SELECT COUNT(DISTINCT ql.QueueListID) 
                FROM Queue_list ql 
                WHERE ql.CreatorID = 11 AND ql.CourseID = 12) AS total_count
            FROM
                Question q
            WHERE
                q.UserID = 11
        ),
        TopUsers AS (
            SELECT
                u.UserID,
                u.UserName,
                COUNT(q.QAID) AS question_count
            FROM
                User u
            JOIN
                Question q ON u.UserID = q.UserID
            WHERE
                u.UserID <> 11
            GROUP BY
                u.UserID,
                u.UserName
            ORDER BY
                question_count DESC
            LIMIT 5
        )

        SELECT
            tu.UserID,
            tu.UserName,
            tu.question_count,
            COALESCE(e.joined_count, 0) AS joined_count,
            COALESCE(e.total_count, 0) AS total_count,
            CASE
                WHEN e.total_count > 0 THEN (COALESCE(e.joined_count, 0) * 100.0 / e.total_count)
                ELSE 0
            END AS engagement_percentage
        FROM
            TopUsers tu
        LEFT JOIN
            Engagement e ON 1=1;
        `;

    connection.query(sql, [userId, userId, courseId, userId, courseId], (err, results) => {
        if (err) {
            console.error('Error fetching top 5 asking users:', err);
            res.status(500).send('Server error');
            return;
        }

        res.status(200).json(results);
        connection.end(); // End the connection after the query
    });
});


module.exports = router;
