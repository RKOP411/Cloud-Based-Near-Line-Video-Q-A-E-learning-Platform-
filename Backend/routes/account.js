var express = require('express');
var router = express.Router();
const { connectToDB } = require('../util/db');


router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/verifyAccount', async function (req, res, next) {
    let connection;
    try {
        // Establish a database connection
        connection = await connectToDB();

        // Get the email from the query parameters
        const email = req.query.email;

        if (!email) {
            return res.status(400).send('Email is required');
        }

        // Query the database to find the user by email
        const [rows] = await connection.execute('SELECT * FROM user WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).send('Account not found');
        }

        // If user is found, send a success response
        res.status(200).send(`Account verified for email: ${email}`);
    } catch (error) {
        console.error('Error connecting to the database or verifying email:', error);
        res.status(500).send('Server error');
    } finally {
        if (connection) {
            await connection.end(); // Close the connection
        }
    }
});



router.post('/register', async function (req, res, next) {
    const { UserName, Email, Password, Role } = req.body;

    // Simple validation (you can expand this as needed)
    if (!UserName || !Email || !Password) {
        return res.status(400).send('Missing required fields');
    }

    try {
        const connection = await connectToDB();

        const sql = `INSERT INTO User (UserName, Email, Password, Role) 
                     VALUES (?, ?, ?, ?)`;

        const values = [UserName, Email, Password, Role];

        connection.query(sql, values, (err, results) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).send('Database error');
            }
            console.log('User registered with ID:', results.insertId);
            res.status(201).send('User registered successfully');
        });

        // Close the connection
        connection.end();

    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
