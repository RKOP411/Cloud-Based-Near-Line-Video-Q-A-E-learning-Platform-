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

router.get('/getNotifications/:UserID', async (req, res) => {
  const { UserID } = req.params;
  const connection = await connectToDB();
  const sql = `
    SELECT 
        n.QAID,
        MIN(n.NotificationID) AS NotificationID, 
        MIN(n.UserID) AS UserID, 
        MAX(n.Message) AS Message, 
        MAX(n.CreatedAt) AS CreatedAt, 
        MAX(n.IsRead) AS IsRead,
        MAX(q.ASID) AS ASID, 
        MAX(q.Text) AS Text, 
        MAX(qu.QuestionTitle) AS QuestionTitle,
        MAX(u.UserID) AS AnswerUserID, 
        MAX(u.UserName) AS UserName, 
        MAX(u.T_rank) AS T_rank,
        MAX(ql.QueueListID) AS QueueListID, 
        MAX(ql.Status) AS QueueListStatus, 
        MAX(c.CourseID) AS CourseID, 
        MAX(c.CourseName) AS CourseName,
        MAX(qu.UserID) AS StudentID
    FROM notifications n
    JOIN (
        SELECT MIN(NotificationID) AS NotificationID, QAID
        FROM notifications
        GROUP BY QAID
    ) unique_notifications ON n.NotificationID = unique_notifications.NotificationID
    JOIN answer q ON unique_notifications.QAID = q.QAID 
    JOIN user u ON n.UserID = u.UserID
    JOIN Question qu ON q.QAID = qu.QAID  
    JOIN queue_list ql ON qu.QueueListID = ql.QueueListID  
    JOIN course c ON ql.CourseID = c.CourseID
    WHERE n.QAID IS NOT NULL
    AND qu.UserID = ?
    AND n.IsRead = 0
    GROUP BY n.QAID;
  `;

  connection.query(sql, [UserID], (err, results) => {
    if (err) {
      console.error('Error fetching notifications:', err);
      res.status(500).send('Server error');
      return;
    }

    res.status(200).json(results);
    connection.end(); // End the connection after the query
  });
});

router.put('/removeNotificationByNotificationID/:NotificationID', async (req, res) => {
  const { NotificationID } = req.params;

  if (!NotificationID) {
    console.error("Notification ID is undefined");
    return res.status(400).send('Notification ID is required');
  }

  const connection = await connectToDB();
  const sql = `UPDATE notifications SET IsRead = 1 WHERE NotificationID = ?`;

  connection.query(sql, [NotificationID], (err, results) => {
    if (err) {
      console.error('Error updating notification:', err);
      res.status(500).send('Server error');
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }

    res.status(200).json({ message: 'Notification updated successfully' });
    connection.end(); // End the connection after the query
  });
});

router.get('/getInvitation/:UserID', async (req, res) => {
  const { UserID } = req.params;

  if (!UserID) {
    console.error("User ID is undefined");
    return res.status(400).send('User ID is required');
  }

  const connection = await connectToDB();
  const sql = `
    SELECT 
      invitation.InvitationID, 
      User.UserName, 
      User.Email, 
      Course.CourseName, 
      Queue_list.CourseWeek,
      invitation.CreatedAt,
      invitation.QueueListID
    FROM invitation
    JOIN User ON invitation.SenderID = User.UserID
    JOIN Queue_list ON invitation.QueueListID = Queue_list.QueueListID
    JOIN Course ON Queue_list.CourseID = Course.CourseID
    WHERE invitation.UserID = ?;
  `;

  connection.query(sql, [UserID], (err, results) => {
    if (err) {
      console.error('Error fetching invitation:', err);
      res.status(500).send('Server error');
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'Invitation not found' });
      return;
    }

    res.status(200).json(results);
    connection.end(); // End the connection after the query
  });
});

router.put('/removeInvitationByInvitationID/:InvitationID', async (req, res) => {
  const { InvitationID } = req.params;

  if (!InvitationID) {
    console.error("Invitation ID is undefined");
    return res.status(400).send('Invitation ID is required');
  }

  const connection = await connectToDB();
  const sql = `DELETE FROM invitation WHERE InvitationID = ?`;

  connection.query(sql, [InvitationID], (err, results) => {
    if (err) {
      console.error('Error deleting invitation:', err);
      res.status(500).send('Server error');
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Invitation not found' });
      return;
    }

    res.status(200).json({ message: 'Invitation deleted successfully' });
    connection.end(); // End the connection after the query
  });
}
);

router.post('/JoinInvitation/:UserID/:QueueListID', async (req, res) => {
  const { UserID, QueueListID } = req.params;

  if (!UserID || !QueueListID) {
    console.error("User ID or Queue List ID is undefined");
    return res.status(400).send('User ID and Queue List ID are required');
  }

  const connection = await connectToDB();
  const sql = `
    INSERT INTO Queue_Helper (QueueListID, UserID)
    VALUES (?, ?)
  `;

  connection.query(sql, [QueueListID, UserID], (err, results) => {
    if (err) {
      console.error('Error joining invitation:', err);
      res.status(500).send('Server error');
      return;
    }

    res.status(200).json({ message: 'User successfully joined the queue' });
    connection.end(); // End the connection after the query
  });
});

module.exports = router;
