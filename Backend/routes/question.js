var express = require('express');
var router = express.Router();
const { connectToDB } = require('../util/db');
const multer = require('multer');
const path = require('path');
const cors = require('cors')
const app = express();
app.use(cors());
const natural = require('natural');

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


        const sql4 = `INSERT INTO notifications (UserID, QAID, Message, IsRead, CreatedAt) VALUES (?, ?, ?, FALSE, NOW())`;
        connection.query(sql4, [UserID, QAID, 'Your question has been answered.']);

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

router.get('/GetQuestionByUserID/:UserID', async function (req, res, next) {
    try {
        const { UserID } = req.params;
        const connection = await connectToDB();

        // First Query: Get all questions for the user
        const sql = `SELECT 
                    q.*, 
                    m.*, 
                    u.UserName, 
                    ql.*,  -- Select columns from queue_list
                    c.*    -- Select columns from Course
                FROM 
                    Question q  
                LEFT JOIN 
                    User u ON q.UserID = u.UserID 
                LEFT JOIN 
                    Media m ON q.MediaID = m.MediaID 
                LEFT JOIN 
                    queue_list ql ON q.QueueListID = ql.QueueListID  -- Join with queue_list
                LEFT JOIN 
                    Course c ON ql.CourseID = c.CourseID  -- Join with Course
                WHERE 
                    q.UserID = ?;`;

        connection.query(sql, [UserID], async (err, questionsResults) => {
            if (err) {
                console.error('Error getting Question:', err);
                return res.status(500).json({ message: 'Database error' });
            }

            // Check if questions were found
            if (!questionsResults || questionsResults.length === 0) {
                connection.end();
                return res.status(404).json({ message: 'No questions found for this user.' });
            }

            try {
                // Calculate currentQueueCount for each question
                const questionsWithCount = await Promise.all(
                    questionsResults.map(async (question) => {
                        // Initialize currentQueueCount
                        let currentQueueCount = 0;

                        // Query the position of the current question in the queue
                        const sqlPosition = `
                            SELECT COUNT(*) AS position
                            FROM question
                            WHERE Type = ? AND Replied = 0
                              AND QAID <= ?
                              AND QueueListID = ?;;
                        `;

                        // Execute the query asynchronously for each question
                        const [positionResult] = await connection.promise().query(sqlPosition, [question.Type, question.QAID, question.QueueListID]);
                        currentQueueCount = positionResult[0].position - 1; // Subtract 1 to exclude the current question itself

                        // Add currentQueueCount to the question
                        return {
                            ...question,
                            currentQueueCount: currentQueueCount,
                        };
                    })
                );

                // Send the combined results back to the client
                res.status(200).json({
                    questions: questionsWithCount,
                });
            } catch (error) {
                console.error('Error processing questions:', error);
                res.status(500).json({ message: 'Error processing questions' });
            } finally {
                // Close the connection after the response is sent
                connection.end();
            }
        });

    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
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
    let connection;
    try {
        const { QueueListID } = req.params;
        const connection = await connectToDB();

        const sql1 = `
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


        const sql2 = `
        SELECT
            ql.QueueListID,
            ql.CourseID,
            ql.CreatorID AS TeacherUserID,
            ql.Status,
            ql.Created,
            ql.CloseDate,
            ql.CourseWeek,
            ql.AccessCode,
            ql.TimeOut,
            c.* 
        FROM 
            queue_list ql
        JOIN 
            course c ON ql.CourseID = c.CourseID
        WHERE 
            ql.QueueListID = ?;
        `;

        const results = await Promise.all([
            new Promise((resolve, reject) => {
                connection.query(sql1, [QueueListID], (err, results) => {
                    if (err) {
                        console.error('Error getting Question:', err);
                        console.log("Database error");
                        reject(err);
                    }
                    resolve(results);
                });
            }
            ),
            new Promise((resolve, reject) => {
                connection.query(sql2, [QueueListID], (err, results) => {
                    if (err) {
                        console.error('Error getting Question:', err);
                        console.log("Database error");
                        reject(err);
                    }
                    resolve(results);
                });
            }
            )
        ]);
        const response = {
            questions: results[0],
            question: results[1]
        }
        res.status(200).json(response);

        connection.end();


    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    } finally {
        if (connection) await connection.end(); // Ensure the connection is closed
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


router.get('/CheckSimilar/:UserInput', async function (req, res) {
    try {
        const { UserInput } = req.params;
        const connection = await connectToDB();

        // Fetch QAID and Description from the question table
        const sql = `
            SELECT 
                Question.QAID, 
                Question.Description, 
                Answer.Text 
            FROM 
                Question 
            LEFT JOIN 
                Answer 
            ON 
                Question.QAID = Answer.QAID
            GROUP BY 
                Question.QAID, Answer.Text;
            `;
        const [questions] = await connection.promise().query(sql);

        // Find similar questions
        const similarQuestions = questions.filter(question =>
            isSimilarToUserQuestion(UserInput, question.Description)
        );

        res.status(200).json({
            userInput: UserInput,
            similarQuestions: similarQuestions,
            count: similarQuestions.length
        });

        connection.end();
    } catch (error) {
        console.error('Error checking similar questions:', error);
        res.status(500).send('Server error');
    }
});

function isSimilarToUserQuestion(userInput, dbQuestion) {
    // Normalize both inputs
    const userText = userInput.toLowerCase();
    const dbText = dbQuestion.toLowerCase();

    // 1. Check if either is a question
    const userIsQuestion = /^(what|how|can|explain|define||do|who|where|when|why|which|whose|could|may|should|would)/i.test(userText);
    const dbIsQuestion = /^(what|how|can|explain|define||do|who|where|when|why|which|whose|could|may|should|would)/i.test(dbText);

    // If one is question and other isn't, they're not similar
    if (userIsQuestion !== dbIsQuestion) return false;

    // 2. Check keyword similarity using TF-IDF
    const tfidf = new natural.TfIdf();
    tfidf.addDocument(userText);
    tfidf.addDocument(dbText);

    const userTerms = new Set();
    const dbTerms = new Set();

    tfidf.listTerms(0).forEach(item => userTerms.add(item.term));
    tfidf.listTerms(1).forEach(item => dbTerms.add(item.term));

    // Calculate Jaccard similarity
    const intersection = new Set([...userTerms].filter(term => dbTerms.has(term)));
    const union = new Set([...userTerms, ...dbTerms]);
    const similarity = intersection.size / union.size;

    // 3. Check for specific important terms
    const importantTerms = ['algorithm', 'complexity', 'sort', 'recursion', 'structure'];
    const hasImportantTerm = importantTerms.some(term =>
        userText.includes(term) || dbText.includes(term)
    );

    // Consider similar if either:
    // - Similarity score > 0.4
    // - Shares important term and similarity > 0.2
    return similarity > 0.4 || (hasImportantTerm && similarity > 0.2);
}


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
