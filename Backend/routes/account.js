var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.send('respond with a resource');
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
