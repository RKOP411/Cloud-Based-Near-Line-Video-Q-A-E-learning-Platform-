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

router.get('/GetQueue/:QueueListID', async (req, res) => {
    try {
        const { QueueListID } = req.params;

        const connection = await connectToDB();
        const countTheoryQuery = 'SELECT COUNT(*) AS count FROM Question WHERE Type = "Theory" AND Replied = 0 AND QueueListID = ?';

        const countLabWorkQuery = 'SELECT COUNT(*) AS count FROM Question WHERE Type = "lab-work" AND Replied = 0 AND QueueListID = ?';

        const countDebuggingQuery = 'SELECT COUNT(*) AS count FROM Question WHERE Type = "Debugging" AND Replied = 0 AND QueueListID = ?';

        const countAssignmentsQuery = 'SELECT COUNT(*) AS count FROM Question WHERE Type = "Assignments" AND Replied = 0 AND QueueListID = ?';

        const results = await Promise.all([
            new Promise((resolve, reject) => {
                connection.query(countTheoryQuery, [QueueListID], (error, results) => {
                    if (error) return reject(error);
                    resolve(results[0].count);
                });
            }),
            new Promise((resolve, reject) => {
                connection.query(countLabWorkQuery, [QueueListID], (error, results) => {
                    if (error) return reject(error);
                    resolve(results[0].count);
                });
            }),
            new Promise((resolve, reject) => {
                connection.query(countDebuggingQuery, [QueueListID], (error, results) => {
                    if (error) return reject(error);
                    resolve(results[0].count);
                });
            }),
            new Promise((resolve, reject) => {
                connection.query(countAssignmentsQuery, [QueueListID], (error, results) => {
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
function generateAccessCode(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let accessCode = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        accessCode += characters[randomIndex];
    }
    return accessCode;
}

router.post('/CreateQueue_list', async (req, res) => {
    try {
        const { CourseID, TimeOut, CreatorID } = req.body;

        // Ensure required fields are provided
        if (!CourseID || !TimeOut) {
            return res.status(400).send('CourseID and TimeOut are required');
        }

        const connection = await connectToDB();

        let CourseWeek = 1;

        //Get the latest CourseWeek by CourseID and CreatorID
        const queryCourseWeek = 'SELECT CourseWeek FROM Queue_list WHERE CourseID = ? AND CreatorID = ? ORDER BY CourseWeek DESC LIMIT 1';
        await new Promise((resolve, reject) => {
            connection.query(queryCourseWeek, [CourseID, CreatorID], (error, results) => {
                if (error) return reject(error);
                if (results.length > 0) {
                    CourseWeek = results[0].CourseWeek + 1;
                }
                resolve(results);
            });
        });

        //generate AccessCode
        let AccessCode = generateAccessCode();

        // Insert into the Queue_list
        const query = "INSERT INTO Queue_list (CourseID, CreatorID, Status, Created, CloseDate, CourseWeek, TimeOut, AccessCode) VALUES (?, ?, 'RUNNING', NOW(), NULL, ?, ?, ?)";
        await new Promise((resolve, reject) => {
            connection.query(query, [CourseID, CreatorID, CourseWeek, TimeOut, AccessCode], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });





        res.status(200).send('Queue_list added successfully');

        // Ensure connection is closed
        connection.end();
    } catch (error) {
        console.error('Error adding to Queue_list:', error);
        res.status(500).send('Server error');
    }
});


router.get('/GetQueue_listByCreatorID/:CreatorID', async (req, res) => {
    try {
        const { CreatorID } = req.params;

        if (!CreatorID) {
            return res.status(400).send('CreatorID is required');
        }

        const connection = await connectToDB();

        // Query to get Queue_list by CreatorID
        const query = 'SELECT Queue_list.*, Course.CourseName FROM Queue_list JOIN Course ON Queue_list.CourseID = Course.CourseID WHERE Queue_list.CreatorID = ?';
        const results = await new Promise((resolve, reject) => {
            connection.query(query, [CreatorID], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        res.status(200).json(results);

        // Ensure connection is closed
        connection.end();
    } catch (error) {
        console.error('Error retrieving Queue_list:', error);
        res.status(500).send('Server error');
    }
});

router.get('/GetQueueTimeryCreatorID/:CreatorID', async (req, res) => {
    try {
        const { CreatorID } = req.params;

        if (!CreatorID) {
            return res.status(400).send('CreatorID is required');
        }

        const connection = await connectToDB();

        // Query to get the queue times by CreatorID
        const query = `
            SELECT TimeOut, QueueListID
            FROM Queue_list
            WHERE Queue_list.CreatorID = ?
        `;
        const results = await new Promise((resolve, reject) => {
            connection.query(query, [CreatorID], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        res.status(200).json(results);

        // Ensure connection is closed
        connection.end();
    } catch (error) {
        console.error('Error retrieving queue times:', error);
        res.status(500).send('Server error');
    }
});


router.get('/FindQueueByAccessCode/:AccessCode', async (req, res) => {
    try {
        const { AccessCode } = req.params;

        if (!AccessCode) {
            return res.status(400).send('AccessCode is required');
        }

        const connection = await connectToDB();

        // Query to get QueueListID by AccessCode
        const query = 'SELECT QueueListID FROM Queue_list WHERE AccessCode = ? AND Status = "RUNNING"';
        const results = await new Promise((resolve, reject) => {
            connection.query(query, [AccessCode], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        if (results.length === 0) {
            return res.status(404).send('QueueListID not found');
        }

        res.status(200).json({ QueueListID: results[0].QueueListID });

        // Ensure connection is closed
        connection.end();
    } catch (error) {
        console.error('Error retrieving QueueListID:', error);
        res.status(500).send('Server error');
    }
});

router.get('/getAvgTakeTimeByUserID/:UserID', async (req, res) => {
    try {
        const { UserID } = req.params;
        let avg_taketime = 0;
        let Num_Waiting = 0;
        if (!UserID) {
            return res.status(400).send('UserID is required');
        }

        const connection = await connectToDB();

        // Query to get the average TakeTime by UserID from Answer table
        const query = 'SELECT AVG(TakeTime) AS avg_take_time FROM Answer WHERE UserID = ? GROUP BY UserID';
        const results = await new Promise((resolve, reject) => {
            connection.query(query, [UserID], (error, results) => {
                if (error) return reject(error);
                avg_taketime = results.length > 0 ? results[0].avg_take_time : 0;
                resolve(results);
            });
        });

        const waitingQuery = 'SELECT COUNT(*) AS WaitingCount FROM Customer_queue WHERE Status = "waiting"';
        const waitingResults = await new Promise((resolve, reject) => {
            connection.query(waitingQuery, (error, results) => {
                if (error) return reject(error);
                Num_Waiting = results[0].WaitingCount;
                resolve(results);
            });
        });

        const response = {
            Estimated: avg_taketime * Num_Waiting,
            Avg: avg_taketime,
            Num_Waiting: Num_Waiting

        };


        if (results.length === 0) {
            return res.status(404).send('No records found');
        }

        res.status(200).json(response);

        // Ensure connection is closed
        connection.end();
    } catch (error) {
        console.error('Error retrieving TakeTime:', error);
        res.status(500).send('Server error');
    }
});


router.post('/JoinQueue', async (req, res) => {
    try {
        const { QueueListID, UserID } = req.body;

        // Ensure required fields are provided
        if (!QueueListID || !UserID) {
            return res.status(400).send('QueueListID and UserID are required');
        }

        const connection = await connectToDB();

        // Check if the user is already in the queue
        const checkQuery = 'SELECT * FROM Queue_Students WHERE QueueListID = ? AND UserID = ?';
        const existingEntry = await new Promise((resolve, reject) => {
            connection.query(checkQuery, [QueueListID, UserID], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        if (existingEntry.length > 0) {
            return res.status(400).send('User is already in the queue');
        }

        // Insert into the Queue_Students
        const query = 'INSERT INTO Queue_Students (QueueListID, UserID) VALUES (?, ?)';
        await new Promise((resolve, reject) => {
            connection.query(query, [QueueListID, UserID], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        res.status(200).send('User joined the queue successfully');

        // Ensure connection is closed
        connection.end();
    } catch (error) {
        console.error('Error joining the queue:', error);
        res.status(500).send('Server error');
    }
});

router.get('/getCurrentJoins/:QueueListID', async (req, res) => {
    try {
        const { QueueListID } = req.params;

        if (!QueueListID) {
            return res.status(400).send('QueueListID is required');
        }

        const connection = await connectToDB();

        // Query to get the current joins by QueueListID
        const query = 'SELECT COUNT(UserID) AS userCount FROM Queue_Students WHERE QueueListID = ?';
        const results = await new Promise((resolve, reject) => {
            connection.query(query, [QueueListID], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        res.status(200).json(results);

        // Ensure connection is closed
        connection.end();
    } catch (error) {
        console.error('Error retrieving current joins:', error);
        res.status(500).send('Server error');
    }
});

router.delete('/QuitQueue', async (req, res) => {
    try {
        const { QueueListID, UserID } = req.body;

        // Ensure required fields are provided
        if (!QueueListID || !UserID) {
            return res.status(400).send('QueueListID and UserID are required');
        }

        const connection = await connectToDB();

        // Delete from the Queue_Students
        const query = 'DELETE FROM Queue_Students WHERE QueueListID = ? AND UserID = ?';
        await new Promise((resolve, reject) => {
            connection.query(query, [QueueListID, UserID], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        res.status(200).send('User quit the queue successfully');

        // Ensure connection is closed
        connection.end();
    } catch (error) {
        console.error('Error quitting the queue:', error);
        res.status(500).send('Server error');
    }
});


router.post('/PauseQueue', async (req, res) => {
    try {
        const { QueueListID } = req.body;

        // Ensure QueueListID is provided
        if (!QueueListID) {
            return res.status(400).send('QueueListID is required');
        }

        const connection = await connectToDB();

        // Update the status of the queue to 'PAUSED'
        const query = 'UPDATE Queue_list SET Status = "PAUSED" WHERE QueueListID = ?';
        await new Promise((resolve, reject) => {
            connection.query(query, [QueueListID], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        res.status(200).send('Queue paused successfully');

        // Ensure connection is closed
        connection.end();
    } catch (error) {
        console.error('Error pausing the queue:', error);
        res.status(500).send('Server error');
    }
});

router.post('/CloseQueue', async (req, res) => {
    try {
        const { QueueListID } = req.body;

        // Ensure QueueListID is provided
        if (!QueueListID) {
            return res.status(400).send('QueueListID is required');
        }

        const connection = await connectToDB();

        // Update the status of the queue to 'CLOSED' and set the CloseDate to now
        const query = 'UPDATE Queue_list SET Status = "CLOSED", CloseDate = NOW() WHERE QueueListID = ?';
        await new Promise((resolve, reject) => {
            connection.query(query, [QueueListID], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        res.status(200).send('Queue closed successfully');

        // Ensure connection is closed
        connection.end();
    } catch (error) {
        console.error('Error closing the queue:', error);
        res.status(500).send('Server error');
    }
});

router.post('/RunQueue', async (req, res) => {
    try {
        const { QueueListID } = req.body;

        // Ensure QueueListID is provided
        if (!QueueListID) {
            return res.status(400).send('QueueListID is required');
        }

        const connection = await connectToDB();

        // Update the status of the queue to 'RUNNING'
        const query = 'UPDATE Queue_list SET Status = "RUNNING" WHERE QueueListID = ?';
        await new Promise((resolve, reject) => {
            connection.query(query, [QueueListID], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        res.status(200).send('Queue is now running');

        // Ensure connection is closed
        connection.end();
    } catch (error) {
        console.error('Error running the queue:', error);
        res.status(500).send('Server error');
    }
});

router.get('/GetQueueStatus/:QueueListID', async (req, res) => {
    try {
        const { QueueListID } = req.params;

        if (!QueueListID) {
            return res.status(400).send('QueueListID is required');
        }

        const connection = await connectToDB();

        // Query to get the status of the queue by QueueListID
        const query = 'SELECT Status FROM Queue_list WHERE QueueListID = ?';
        const results = await new Promise((resolve, reject) => {
            connection.query(query, [QueueListID], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        if (results.length === 0) {
            return res.status(404).send('Queue not found');
        }

        res.status(200).json({ Status: results[0].Status });

        // Ensure connection is closed
        connection.end();
    } catch (error) {
        console.error('Error retrieving queue status:', error);
        res.status(500).send('Server error');
    }
});

// Export the router
module.exports = router;