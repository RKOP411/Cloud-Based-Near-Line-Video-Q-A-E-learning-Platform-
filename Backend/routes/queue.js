const express = require('express');
const router = express.Router();
const { connectToDB } = require('../util/db');
const cors = require('cors');

// Use CORS middleware at the router level if needed
router.use(cors());

router.post('/AddCustomrQueue', async (req, res) => {
    try {
        const { UserID, Status } = req.body;

        // console.log('req.body:', req.body);
        // console.log('UserID:', UserID);
        // console.log('Status:', Status);

        // Ensure required fields are provided
        if (!UserID || !Status) {
            return res.status(400).send('All fields are required');
        }

        // console.log('Ok1');

        const connection = await connectToDB();
        //Get QAID From Question last record Where UserID = UserID
        const queryQAID = 'SELECT QAID FROM Question WHERE UserID = ? ORDER BY QAID DESC LIMIT 1';
        let QAID;
        await new Promise((resolve, reject) => {
            connection.query(queryQAID, [UserID], (error, results) => {
                if (error) return reject(error);
                QAID = results[0].QAID;
                resolve(results);
            });
        });
        // console.log('Ok2');
        //Get Position from queue.CurrentQueue
        const queryPosition = 'SELECT CurrentQueue FROM queue';
        let Position;
        await new Promise((resolve, reject) => {
            connection.query(queryPosition, (error, results) => {
                if (error) return reject(error);
                Position = results.length > 0 ? results[0].count : 0;
                resolve(results);
            });
        });
        // console.log('Ok3'); 

        // Insert into the Customer_queue
        const query = 'INSERT INTO Customer_queue (UserID, QAID, Status, Position) VALUES (?, ?, ?, ?)';
        await new Promise((resolve, reject) => {
            connection.query(query, [UserID, QAID, Status, Position], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        // console.log('Ok4');

        res.status(200).send('Customer queue added successfully');

        // Ensure connection is closed
        connection.end();
    } catch (error) {
        console.error('Error adding customer queue:', error);
        res.status(500).send('Server error');
    }

});


router.post('/AddQueue', async (req, res) => {
    try {
        const { QueueType, UserID } = req.body;

        // console.log('req.body:', req.body);

        // Ensure QueueType is provided
        if (!QueueType) {
            return res.status(400).send('QueueType is required');
        }

        const connection = await connectToDB();
        // console.log('Ok-1');
        //Get CusID From Customer_queue last record Where UserID = UserID
        const queryCusID = 'SELECT CusID FROM Customer_queue WHERE UserID = ? ORDER BY CusID DESC LIMIT 1';
        let CusID;
        await new Promise((resolve, reject) => {
            connection.query(queryCusID, [UserID], (error, results) => {
                if (error) return reject(error);
                CusID = results[0].CusID;
                resolve(results);
            });
        });

        // console.log('Ok-2');

        // Get the maximum CurrentQueue value
        const queryMaxQueue = 'SELECT IFNULL(MAX(CurrentQueue), 0) + 1 AS NextQueue FROM Queue';
        let NextQueue;
        await new Promise((resolve, reject) => {
            connection.query(queryMaxQueue, (error, results) => {
                if (error) return reject(error);
                NextQueue = results[0].NextQueue;
                resolve(results);
            });
        });

        // Insert into the Queue
        const query = 'INSERT INTO Queue (QueueType, CurrentQueue, CusID) VALUES (?, ?, ?)';
        await new Promise((resolve, reject) => {
            connection.query(query, [QueueType, NextQueue, CusID], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        // console.log('Ok-3');
        res.status(200).send('Queue added successfully');

        // Ensure connection is closed
        connection.end();
    } catch (error) {
        console.error('Error adding queue:', error);
        res.status(500).send('Server error');
    }
});

router.get('/GetQueue', async (req, res) => {
    try {

        const connection = await connectToDB();
        const countTheoryQuery = 'SELECT COUNT(*) AS count FROM Question WHERE Type = "Theory" AND Replied = 0';

        const countLabWorkQuery = 'SELECT COUNT(*) AS count FROM Question WHERE Type = "Lab Work" AND Replied = 0';

        const countDebuggingQuery = 'SELECT COUNT(*) AS count FROM Question WHERE Type = "Debugging" AND Replied = 0'; 

        const countAssignmentsQuery = 'SELECT COUNT(*) AS count FROM Question WHERE Type = "Assignments" AND Replied = 0';

        const results = await Promise.all([
            new Promise((resolve, reject) => {
                connection.query(countTheoryQuery, (error, results) => {
                    if (error) return reject(error);
                    resolve(results[0].count);
                });
            }),
            new Promise((resolve, reject) => {
                connection.query(countLabWorkQuery, (error, results) => {
                    if (error) return reject(error);
                    resolve(results[0].count);
                });
            }),
            new Promise((resolve, reject) => {
                connection.query(countDebuggingQuery, (error, results) => {
                    if (error) return reject(error);
                    resolve(results[0].count);
                });
            }),
            new Promise((resolve, reject) => {
                connection.query(countAssignmentsQuery, (error, results) => {
                    if (error) return reject(error);
                    resolve(results[0].count);
                });
            })
        ]);

        const response = {
            Theory: results[0],
            "Lab Work": results[1],
            Debugging: results[2],
            Assignments: results[3]
        };

        res.status(200).json(response);

        connection.end();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});


// Export the router
module.exports = router;