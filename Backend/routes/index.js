var express = require('express');
var router = express.Router();
const { connectToDB } = require('../util/db');
const cors = require('cors')
const app = express();
app.use(cors());
let timers = {}; // Object to manage timers for user statuses

const timerDuration = 10000; // 10 seconds

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/status', async (req, res) => {
  const { userId, status } = req.body;

  if (userId === undefined || status === undefined) {
    console.error("User ID or status is undefined");
    return res.status(400).send('User ID and status are required');
  }

  const connection = await connectToDB();
  const sql = `UPDATE User SET Status = ? WHERE UserID = ?`;

  connection.query(sql, [status, userId], (err, results) => {
    if (err) {
      console.error('Error updating status:', err);
      res.status(500).send('Server error');
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Clear any existing timer for this user
    clearTimeout(timers[userId]);

    // Set a new timer to check if the user is still online
    timers[userId] = setTimeout(async () => {
      const connection = await connectToDB();
      const sql = `SELECT Status FROM User WHERE UserID = ?`;
      connection.query(sql, [userId], (err, results) => {
        if (err) {
          console.error('Error checking status:', err);
          return;
        }
        if (results.length > 0 && results[0].Status !== status) {
          const updateSql = `UPDATE User SET Status = 'Offline' WHERE UserID = ?`;
          connection.query(updateSql, [userId], (err, results) => {
            if (err) {
              console.error('Error updating status to offline:', err);
              return;
            }
           // console.log(`User ${userId} status set to Offline due to inactivity`);
          });
        }
      });
    }, timerDuration);
    connection.end(); // End the connection after the timer callback

    res.status(200).json({ message: 'Status updated successfully' });
    console.log(`User ${userId} is now ${status}`);
  });

  // connection.end(); // End the connection after the query
});


router.get('/GetStatus/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    console.error("User ID is undefined");
    return res.status(400).send('User ID is required');
  }

  const connection = await connectToDB();
  const sql = `SELECT Status FROM User WHERE UserID = ?`;

  connection.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching status:', err);
      res.status(500).send('Server error');
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ status: results[0].Status });
    connection.end(); // End the connection after the query
  });
});

router.get('/getUser', async (req, res) => {
  const connection = await connectToDB();
  const sql = `SELECT * FROM User`;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).send('Server error');
      return;
    }

    res.status(200).json(results);
    connection.end(); // End the connection after the query
  });
});

router.get('/getMedia', async (req, res) => {
  const connection = await connectToDB();
  const sql = `SELECT * FROM Media`;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching media:', err);
      res.status(500).send('Server error');
      return;
    }

    res.status(200).json(results);
    connection.end(); // End the connection after the query
  });
});

module.exports = router;
