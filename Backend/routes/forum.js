var express = require('express');
var router = express.Router();
const { connectToDB } = require('../util/db');

/* GET home page. */
router.get('/GetAllforum', async function (req, res, next) {
    try {
        const connection = await connectToDB();

        const sql = `SELECT  f.*, u.UserName FROM Forum f LEFT JOIN User u  ON f.UserID = u.UserID`;

        connection.query(sql, (err, results) => {
            if (err) {
                console.error('Error getting forum:', err);
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

router.get('/GetforumByID/:forumId', async function (req, res, next) {
    try {
        const connection = await connectToDB();
        const forumId = req.params.forumId; // Get the ForumID from the URL parameter

        const sql = `
            SELECT f.*, u.UserName 
            FROM Forum f 
            LEFT JOIN User u ON f.UserID = u.UserID 
            WHERE f.ForumID = ?`;

        connection.query(sql, [forumId], (err, results) => {
            if (err) {
                console.error('Error retrieving forum:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Forum not found' });
            }

            res.status(200).json(results[0]); // Return the first result
        });

        // Close the connection
        connection.end();

    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});



module.exports = router;
