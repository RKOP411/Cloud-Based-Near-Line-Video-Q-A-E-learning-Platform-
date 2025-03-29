var express = require('express');
var router = express.Router();
const { connectToDB } = require('../util/db');


router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/verifyEmail', async function (req, res, next) {
    try {
        const connection = await connectToDB();
        const email = req.query.email;

        const sql = `SELECT * FROM User WHERE Email = ?`;

        connection.query(sql, email, (err, results) => {
            if (err) {
                console.error('Error getting emails:', err);
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

router.post('/UpdateRankByUserID', async function (req, res, next) {
    const { UserID, T_rank } = req.body;

    // Simple validation
    if (!UserID || !T_rank) {
        return res.status(400).send('Missing required fields');
    }

    try {
        const connection = await connectToDB();


        //Check User is Teacher or not
        const query = 'SELECT Role FROM User WHERE UserID = ?';
        let Role;
        await new Promise((resolve, reject) => {
            connection.query(query, [UserID], (error, results) => {
                if (error) return reject(error);
                Role = results[0].Role;
                resolve(results);
            });
        });

        if (Role != 'Teacher') {
            return res.status(400).send('User is not a teacher');
        } else {

            //Update rank by UserID
            const sql = `UPDATE User SET T_rank = ? WHERE UserID = ?`;

            const values = [T_rank, UserID];

            connection.query(sql, values, (err, results) => {
                if (err) {
                    console.error('Error updating rank:', err);
                    return res.status(500).send('Database error');
                }
                if (results.affectedRows === 0) {
                    return res.status(404).send('User not found');
                }
                console.log('User rank updated for ID:', UserID);
                res.status(200).send('User rank updated successfully');
            });
        }

        // Close the connection
        connection.end();

    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});

router.post('/changePasswordByEmail', async function (req, res, next) {
    const { Email, NewPassword } = req.body;

    // Simple validation
    if (!Email || !NewPassword) {
        return res.status(400).send('Missing required fields');
    }

    try {
        const connection = await connectToDB();

        const sql = `UPDATE User SET Password = ? WHERE Email = ?`;

        const values = [NewPassword, Email];

        connection.query(sql, values, (err, results) => {
            if (err) {
                console.error('Error updating password:', err);
                return res.status(500).send('Database error');
            }
            if (results.affectedRows === 0) {
                return res.status(404).send('User not found');
            }
            console.log('Password updated for Email:', Email);
            res.status(200).send('Password updated successfully');
        });

        // Close the connection
        connection.end();

    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
