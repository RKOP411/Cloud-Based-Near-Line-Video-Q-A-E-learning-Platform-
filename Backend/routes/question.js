var express = require('express');
var router = express.Router();
const { connectToDB } = require('../util/db');
const multer = require('multer');
const path = require('path');
const cors = require('cors')
const app = express();
app.use(cors());



router.get('/GetAllQuestion', async function (req, res, next) {
    try {
        const connection = await connectToDB();

        const sql = `
        SELECT 
            q.*, 
            u.UserName 
        FROM 
            Question q
        JOIN 
            User u ON q.UserID = u.UserID
        WHERE 
            q.Replied = 0
        ORDER BY 
            q.UploadTime
    `;
        connection.query(sql, (err, results) => {
            if (err) {
                console.error('Error getting courses:', err);
                console.log("Database error");
            }
            console.log(results);
            res.status(200).json(results);
        });

        // Close the connection
        connection.end();

    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});


module.exports = router;
