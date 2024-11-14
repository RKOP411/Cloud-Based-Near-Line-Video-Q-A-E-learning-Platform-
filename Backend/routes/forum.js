var express = require('express');
var router = express.Router();
const { connectToDB } = require('../util/db');

/* GET home page. */
router.get('/GetAllforum', async function (req, res, next) {
    try {
        const connection = await connectToDB();

        const sql = `SELECT * FROM Forum`;

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

router.get('/GetforumByID', async function (req, res, next) {

    try {
        const connection = await connectToDB();
        const id = req.query.id;

        const sql = `SELECT * FROM Forum WHERE ForumID = ?`;

        connection.query(sql, id, (err, results) => {
            if (err) {
                console.error('Error getting forum:', err);
                console.log("Database error");
            }
            console.log(results);
            res.status(200).json(results);
        });
        connection.end();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');

    }
});

module.exports = router;
