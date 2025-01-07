var express = require('express');
var router = express.Router();
const { connectToDB } = require('../util/db');
const multer = require('multer');
const path = require('path');
const cors = require('cors')
const app = express();
app.use(cors());


router.get('/GetAllQuestion', async function (req, res, next) {
    try {
        const connection = await connectToDB();

        const sql = `
        SELECT 
            q.*, 
            m.*,
            u.UserName 
        FROM 
            Question q
        LEFT JOIN User u ON q.UserID = u.UserID       
        LEFT JOIN Media m ON q.MediaID = m.MediaID 
        WHERE 
            q.Replied = 0
        Order by q.UploadTime
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

router.post('/CreateQuestion', async function (req, res, next) {
    try {
        const { UserID, QuestionTitle, Type, Description } = req.body;


        const connection = await connectToDB();

        const sql = `INSERT INTO Question (UserID, QuestionTitle, Type, Description, UploadTime, Replied, Checking) VALUES (?, ?, ?, ?, NOW(), 0, 0)`;
        connection.query(sql, [UserID, QuestionTitle, Type, Description], (error, results) => {
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
            const { UserID, QuestionTitle, Type, Description } = req.body;
            const VideoPath = req.file ? req.file.path : null;
            const VidoType = req.file ? req.file.mimetype : null;

            console.log('UserID:', UserID);
            console.log('QuestionTitle:', QuestionTitle);
            console.log('Description:', Description);
            console.log('VideoTitle:', VideoTitle);
            console.log('VideoPath:', VideoPath);


            const connection = await connectToDB();

            // Step 1: Insert media details into the Media table
            const sql1 = `INSERT INTO Media (UserID, Video_Type, Title, UploadDate, Path) VALUES (?, ?, ?, NOW(), ?)`;
            connection.query(sql1, [UserID, VidoType, VideoTitle, VideoPath]);

            //Step 2: Retrieve the latest MediaID for the user and title
            const sql2 = `SELECT MediaID FROM Media WHERE UserID = ? AND Title = ? ORDER BY UploadDate DESC LIMIT 1`;
            const [mediaResult] = await connection.promise().query(sql2, [UserID, VideoTitle]);
            const mediaId = mediaResult[0].MediaID;

            // Step 3: Insert the Question
            const sql3 = `INSERT INTO Question (UserID, QuestionTitle, Type, Description, MediaID, UploadTime, Replied, Checking) VALUES (?, ?, ?, ?, ?, NOW(), 0, 0)`;
            connection.query(sql3, [UserID, QuestionTitle, Type, Description, mediaId]);



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
