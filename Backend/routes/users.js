var express = require('express');
var router = express.Router();
const { connectToDB } = require('../util/db');
const multer = require('multer');
const path = require('path');
const cors = require('cors')
const app = express();
app.use(cors());



router.get('/GetAllUser', async function (req, res, next) {
  try {
    const connection = await connectToDB();

    const sql = `SELECT * FROM User`;

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

/* GET users by ID. */
router.get('/GetUserByEmail/:email', async function (req, res, next) {
  try {
    const connection = await connectToDB();
    const email = req.params.email;

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

module.exports = router;
