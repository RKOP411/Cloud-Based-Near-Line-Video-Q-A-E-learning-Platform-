var express = require('express');
var router = express.Router();
const { connectToDB } = require('../util/db');
const cors = require('cors')
const app = express();
app.use(cors());

router.get('/GetTop5Asking/:userId', async (req, res) => {
    const { userId } = req.params;
    const connection = await connectToDB();
    const sql = `
        WITH Engagement AS (
            SELECT 
                COUNT(DISTINCT ql.QueueListID) AS joined_count,
                (SELECT COUNT(DISTINCT QueueListID) FROM Queue_list WHERE UserID = ?) AS total_count
            FROM 
                Queue_list ql
            WHERE 
                ql.UserID = ?
        ),
        TopUsers AS (
            SELECT 
                u.UserID, 
                u.Username, 
                COUNT(q.QuestionID) AS question_count
            FROM 
                User u
            JOIN 
                Question q ON u.UserID = q.UserID
            WHERE 
                q.UserID <> ?  -- Exclude the specified user
            GROUP BY 
                u.UserID, 
                u.Username
            ORDER BY 
                question_count DESC
            LIMIT 5
        )

        SELECT 
            tu.UserID, 
            tu.Username, 
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

    connection.query(sql, [userId, userId, userId], (err, results) => {
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
