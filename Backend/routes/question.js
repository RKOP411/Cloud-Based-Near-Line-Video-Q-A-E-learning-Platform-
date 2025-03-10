var express = require('express');
var router = express.Router();
const { connectToDB } = require('../util/db');
const multer = require('multer');
const path = require('path');
const cors = require('cors')
const app = express();
app.use(cors());

router.post('/AddAnswerByQuestionID', async function (req, res) {
    try {
        const { UserID, QAID, Answer, Timer } = req.body;

        const connection = await connectToDB();

        const sql = `INSERT INTO Answer (UserID, QAID, Text, UploadTime, TakeTime) VALUES (?, ?, ?, NOW(), ?)`;
        connection.query(sql, [UserID, QAID, Answer, Timer]);

        const sql2 = `UPDATE Question SET Replied = 1 WHERE QAID = ?`;
        connection.query(sql2, [QAID])

        const sql3 = `UPDATE Customer_queue SET Status = 'solved' WHERE QAID = ?`;
        connection.query(sql3, [QAID]);

        res.status(200).json({ message: 'Answer added successfully' });
        // Close the connection after the query is executed
        connection.end();
    } catch (error) {
        console.error('Error adding answer:', error);
        res.status(500).send('Server error');
    }
});

router.get('/GetAnswerByQAID/:QAID', async function (req, res, next) {
    try {
        const { QAID } = req.params;
        const connection = await connectToDB();

        const sql = `SELECT 
                    a.*, 
                    u.UserName 
                FROM 
                    Answer a 
                LEFT JOIN User u ON a.UserID = u.UserID 
                WHERE 
                    a.QAID = ?;`;
        connection.query(sql, [QAID], (err, results) => {
            if (err) {
                console.error('Error getting Answer:', err);
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

router.get('/GetQuestionByUserID/:UserID', async function (req, res) {
    const { UserID } = req.params;

    let connection;
    try {
        connection = await connectToDB();
        console.log(`Connected to MySQL as id ${connection.threadId}`); // Log connection ID
        console.log('Requested UserID:', UserID); // Log the requested UserID

        // First Query: Get questions, users, and media
        const sqlQuestions = `
            SELECT 
                q.*, 
                m.*, 
                u.UserName 
            FROM 
                Question q  
            LEFT JOIN User u ON q.UserID = u.UserID 
            LEFT JOIN Media m ON q.MediaID = m.MediaID 
            WHERE 
                q.UserID = ?;`;

        connection.query(sqlQuestions, [UserID], (err, questionsResults) => {
            if (err) {
                console.error('Error getting Question:', err);
                return res.status(500).json({ message: 'Database error' });
            }
            
            console.log('Questions Results:', questionsResults); // Log the results

            // Check if questions were found
            if (!questionsResults || questionsResults.length === 0) {
                return res.status(404).json({ message: 'No questions found for this user.' });
            }

            // Extract Type and QueueListID from the first question result
            const { Type, QueueListID } = questionsResults[0];

            // Second Query: Get CurrentQueue count
            const sqlCount = `
                SELECT COUNT(*) AS count 
                FROM Question 
                WHERE Type = ? AND Replied = 0 AND QueueListID = ?;`;

            connection.query(sqlCount, [Type, QueueListID], (err, countResults) => {
                if (err) {
                    console.error('Error getting CurrentQueue count:', err);
                    return res.status(500).json({ message: 'Database error' });
                }

                // Get the count
                const currentQueueCount = countResults[0].count;

                // Send the combined results back to the client
                res.status(200).json({
                    questions: questionsResults,
                    currentQueueCount: currentQueueCount,
                });
            });
        });

    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
        
    } finally {
        // Ensure connection is closed only if it was opened
        if (connection && connection.state !== 'disconnected') {
            connection.end();
        }
    }
});


router.get('/GetAllQuestion', async function (req, res, next) {
    try {
        const connection = await connectToDB();

        const sql = `
        SELECT 
            q.QAID, 
            q.UserID as StudentUserID, 
            q.MediaID, 
            q.CourseID, 
            q.QuestionTitle, 
            q.Description, 
            q.UploadTime, 
            q.Type, 
            q.Replied, 
            q.Checking, 
            q.QueueListID, 
            m.UserID as MediaUserID,
            m.MediaID, 
            m.Video_Type, 
            m.Title, 
            m.UploadDate, 
            m.Path, 
            u.UserName 
        FROM 
            Question q
        LEFT JOIN User u ON q.UserID = u.UserID       
        LEFT JOIN Media m ON q.MediaID = m.MediaID 
        WHERE 
            q.Replied = 0
        ORDER BY q.UploadTime
    `;
        connection.query(sql, (err, results) => {
            if (err) {
                console.error('Error getting Question:', err);
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

router.get('/GetAllQuestionByQueueListID/:QueueListID', async function (req, res, next) {
    try {
        const { QueueListID } = req.params;
        const connection = await connectToDB();

        const sql = `
        SELECT 
            q.QAID, 
            q.UserID as StudentUserID, 
            q.MediaID, 
            q.CourseID, 
            q.QuestionTitle, 
            q.Description, 
            q.UploadTime, 
            q.Type, 
            q.Replied, 
            q.Checking, 
            q.QueueListID, 
            m.UserID as MediaUserID,
            m.MediaID, 
            m.Video_Type, 
            m.Title, 
            m.UploadDate, 
            m.Path, 
            u.UserName, 
            ql.CreatorID as TeacherUserID,
            ql.CourseID,
            ql.AccessCode,
            c.CourseName
        FROM 
            Question q
        LEFT JOIN User u ON q.UserID = u.UserID       
        LEFT JOIN Media m ON q.MediaID = m.MediaID 
        LEFT JOIN Queue_list ql ON q.QueueListID = ql.QueueListID
        LEFT JOIN Course c ON ql.CourseID = c.CourseID
        WHERE 
            q.QueueListID = ?
        AND
            q.Replied = 0
        ORDER BY q.UploadTime
    `;
        connection.query(sql, [QueueListID], (err, results) => {
            if (err) {
                console.error('Error getting Question:', err);
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

router.get('/GetAllQuestionWithType/:QueueListID/:Type', async function (req, res, next) {
    try {
        const { QueueListID, Type } = req.params;
        const connection = await connectToDB();

        const sql = `
        SELECT 
            q.QAID, 
            q.UserID as StudentUserID, 
            q.MediaID, 
            q.CourseID, 
            q.QuestionTitle, 
            q.Description, 
            q.UploadTime, 
            q.Type, 
            q.Replied, 
            q.Checking, 
            q.QueueListID, 
            m.UserID as MediaUserID,
            m.MediaID, 
            m.Video_Type, 
            m.Title, 
            m.UploadDate, 
            m.Path, 
            u.UserName, 
            ql.CreatorID as TeacherUserID,
            ql.CourseID,
            ql.AccessCode,
            c.CourseName
        FROM 
            Question q
        LEFT JOIN User u ON q.UserID = u.UserID       
        LEFT JOIN Media m ON q.MediaID = m.MediaID 
        LEFT JOIN Queue_list ql ON q.QueueListID = ql.QueueListID
        LEFT JOIN Course c ON ql.CourseID = c.CourseID
        WHERE 
            q.QueueListID = ?
        AND
            q.Replied = 0
        AND
            q.Type = ?
        ORDER BY q.UploadTime
    `;
        connection.query(sql, [QueueListID, Type], (err, results) => {
            if (err) {
                console.error('Error getting Question:', err);
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

router.post('/CreateQuestion', async function (req, res, next) {
    try {
        const { UserID, QuestionTitle, Type, Description, QueueListID } = req.body;


        const connection = await connectToDB();

        const sql = `INSERT INTO Question (UserID, QuestionTitle, Type, Description, UploadTime, Replied, Checking, QueueListID) VALUES (?, ?, ?, ?, NOW(), 0, 0, ?)`;
        connection.query(sql, [UserID, QuestionTitle, Type, Description, QueueListID], (error, results) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).send('Database error');
            }
            res.status(200).json({ message: 'Question created successfully' });
        });

        // Close the connection after the query is executed
        connection.end();
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).send('Server error');
    }
});

router.post('/CreateQuestionWithVideo', async function (req, res, next) {

    let VideoTitle = req.file ? req.file.filename : null;
    // Set up storage for uploaded files
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/question'); // Specify the uploads directory
        },
        filename: (req, file, cb) => {
            VideoTitle = file.originalname;
            cb(null, Date.now() + path.extname(file.originalname)); // Rename file to avoid conflicts
        }
    });


    const upload = multer({ storage: storage }).single('video');

    upload(req, res, async (err) => {
        if (err) {
            console.error('Error uploading video:', err);
            return res.status(500).json({ error: 'Error uploading video' });
        }

        try {
            const { UserID, QuestionTitle, Type, Description, QueueListID } = req.body;
            const VideoPath = req.file ? req.file.path : null;
            const VidoType = req.file ? req.file.mimetype : null;

            // console.log('UserID:', UserID);
            // console.log('QuestionTitle:', QuestionTitle);
            // console.log('Description:', Description);
            // console.log('VideoTitle:', VideoTitle);
            // console.log('VideoPath:', VideoPath);


            const connection = await connectToDB();

            // Step 1: Insert media details into the Media table
            const sql1 = `INSERT INTO Media (UserID, Video_Type, Title, UploadDate, Path) VALUES (?, ?, ?, NOW(), ?)`;
            connection.query(sql1, [UserID, VidoType, VideoTitle, VideoPath]);

            //Step 2: Retrieve the latest MediaID for the user and title
            const sql2 = `SELECT MediaID FROM Media WHERE UserID = ? AND Title = ? ORDER BY UploadDate DESC LIMIT 1`;
            const [mediaResult] = await connection.promise().query(sql2, [UserID, VideoTitle]);
            const mediaId = mediaResult[0].MediaID;

            // Step 3: Insert the Question
            const sql3 = `INSERT INTO Question (UserID, QuestionTitle, Type, Description, MediaID, UploadTime, Replied, Checking, QueueListID) VALUES (?, ?, ?, ?, ?, NOW(), 0, 0, ?)`;
            connection.query(sql3, [UserID, QuestionTitle, Type, Description, mediaId, QueueListID]);



            res.status(200).json({ message: 'Question with video created successfully' });

            // Close the connection
            connection.end();
        } catch (error) {
            console.error('Error creating question with video:', error);
            res.status(500).send('Server error');
        }
    });
});


module.exports = router;
