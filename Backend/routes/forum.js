var express = require('express');
var router = express.Router();
const { connectToDB } = require('../util/db');
const multer = require('multer');
const path = require('path');
const cors = require('cors')
const app = express();
app.use(cors()); // Enable CORS
const bodyParser = require('body-parser');


router.get('/GetAllCourses', async function (req, res, next) {
    try {
        const connection = await connectToDB();

        const sql = `SELECT * FROM Course`;

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
router.get('/GetCoursesByUserID/:userId', async function (req, res, next) {
    try {
        const connection = await connectToDB();
        const userId = req.params.userId; // Get the UserID from the URL parameter

        const sql = `SELECT * FROM Course WHERE UserID = ?`;

        connection.query(sql, [userId], (err, results) => {
            if (err) {
                console.error('Error retrieving courses:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.status(200).json(results);
        });

        // Close the connection
        connection.end();

    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});
router.delete('/RemoveCourseByCourseID/:courseId', async function (req, res, next) {
    try {
        const connection = await connectToDB();
        const courseId = req.params.courseId; // Get the CourseID from the URL parameter

        const sql1 = `DELETE FROM CourseJoin WHERE CourseID = ?`;
        connection.query(sql1, [courseId], (err, results) => {
            if (err) {
                console.error('Error deleting course:', err);
                return res.status(500).json({ error: 'Database error' });
            }
        });

        const sql2 = `DELETE FROM Forum WHERE CourseID = ?`;
        connection.query(sql2, [courseId], (err, results) => {
            if (err) {
                console.error('Error deleting forum:', err);
                return res.status(500).json({ error: 'Database error' });
            }
        });


        //const sql = `DELETE FROM Course WHERE CourseID = ?`;


        

        // Close the connection
        connection.end();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});

router.get('/GetForumByCourseID/:courseId', async function (req, res, next) {
    try {
        const connection = await connectToDB();
        const courseId = req.params.courseId; // Get the CourseID from the URL parameter

        const sql = `SELECT  f.*, u.UserName FROM Forum f LEFT JOIN User u  ON f.UserID = u.UserID WHERE CourseID = ?`;

        connection.query(sql, [courseId], (err, results) => {
            if (err) {
                console.error('Error retrieving forum:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Forum not found' });
            }

            res.status(200).json(results);
        });

        // Close the connection
        connection.end();

    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});

router.get('/GetAllforum', async function (req, res, next) {
    try {
        const connection = await connectToDB();

        const sql = `SELECT  f.*, u.UserName FROM Forum f LEFT JOIN User u  ON f.UserID = u.UserID`;

        connection.query(sql, (err, results) => {
            if (err) {
                console.error('Error getting forum:', err);
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

router.get('/GetforumByID/:forumId', async function (req, res, next) {
    try {
        const connection = await connectToDB();
        const forumId = req.params.forumId; // Get the ForumID from the URL parameter

        const sql = `
        SELECT f.*, m.*, u.UserName 
        FROM Forum f 
        LEFT JOIN User u ON f.UserID = u.UserID 
        LEFT JOIN Media m ON f.MediaID = m.MediaID 
        WHERE f.ForumID = ?`;

        connection.query(sql, [forumId], (err, results) => {
            if (err) {
                console.error('Error retrieving forum:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Forum not found' });
            }

            res.status(200).json(results[0]); // Return the first result
        });

        // Close the connection
        connection.end();

    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});


router.get('/ForumLikes/:forumId', async function (req, res, next) {
    try {
        const connection = await connectToDB();
        const forumId = req.params.forumId; // Get the ForumID from the URL parameter

        const sql = `SELECT COUNT(*) AS Likes FROM ForumLikes WHERE ForumID = ?`;

        connection.query(sql, [forumId], (err, results) => {
            if (err) {
                console.error('Error retrieving forum likes:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.status(200).json(results); // Return the first result
        });

        // Close the connection
        connection.end();

    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});

router.post('/AddLike', async function (req, res, next) {
    try {
        const connection = await connectToDB();
        const { ForumID, UserID } = req.body;

        const sql = `INSERT INTO ForumLikes (ForumID, UserID) VALUES (?, ?)`;

        connection.query(sql, [ForumID, UserID], (err, results) => {
            if (err) {
                console.error('Error adding like:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.status(200).json({ message: 'Like added successfully' });
        });

        // Close the connection
        connection.end();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});

router.get('/CheckUserLiked/:userId/:forumId', async function (req, res, next) {
    try {
        const connection = await connectToDB();
        const userId = req.params.userId; // Get the UserID from the URL parameter
        const forumId = req.params.forumId; // Get the ForumID from the URL parameter

        const sql = `SELECT * FROM ForumLikes WHERE UserID = ? AND ForumID = ?`;

        connection.query(sql, [userId, forumId], (err, results) => {
            if (err) {
                console.error('Error retrieving like:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.status(200).json(results); // Return the results
        });

        // Close the connection (this should be in a finally block)
        connection.end();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});

router.delete('/DeleteLike/:userId/:forumId', async function (req, res, next) {
    try {
        const connection = await connectToDB();
        const userId = req.params.userId; // Get the UserID from the URL parameter
        const forumId = req.params.forumId; // Get the ForumID from the URL parameter

        const sql = `DELETE FROM ForumLikes WHERE UserID = ? AND ForumID = ?`;

        connection.query(sql, [userId, forumId], (err, results) => {
            if (err) {
                console.error('Error deleting like:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.status(200).json({ message: 'Like deleted successfully' });
        });

        // Close the connection
        connection.end();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});

router.get('/GetCommentByForumID/:forumId', async function (req, res, next) {

    try {
        const connection = await connectToDB();
        const forumId = req.params.forumId; // Get the ForumID from the URL parameter

        const sql = `
            SELECT f.*, u.UserName, u.Role
            FROM ForumComment f 
            LEFT JOIN User u ON f.UserID = u.UserID 
            WHERE f.ForumID = ?`;

        connection.query(sql, [forumId], (err, results) => {
            if (err) {
                console.error('Error retrieving forum:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Forum not found' });
            }

            res.status(200).json(results);
        });

        // Close the connection
        connection.end();

    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});

router.post('/AddComment', async function (req, res, next) {
    try {
        const connection = await connectToDB();
        const { ForumID, UserID, Text, SendTime } = req.body;

        const sql = `INSERT INTO ForumComment (ForumID, UserID, Text, SendTime) VALUES (?, ?, ?, NOW())`;

        connection.query(sql, [ForumID, UserID, Text, SendTime], (err, results) => {
            if (err) {
                console.error('Error adding comment:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.status(200).json({ message: 'Comment added successfully' });
        });

        const sql2 = `UPDATE Forum SET Replies = Replies + 1 WHERE ForumID = ?`;

        connection.query(sql2, [ForumID], (err, results) => {
            if (err) {
                console.error('Error updating forum:', err);
                return res.status(500).json({ error: 'Database error' });
            }
        });

        const sql3 = `UPDATE Forum SET LastUpdated = NOW() WHERE ForumID = ?`;

        connection.query(sql3, [ForumID], (err, results) => {
            if (err) {
                console.error('Error updating forum:', err);
                return res.status(500).json({ error: 'Database error' });
            }
        });

        // Close the connection
        connection.end();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});

router.get('/CommentLikes/:commentId', async function (req, res, next) {
    try {
        const connection = await connectToDB();
        const commentId = req.params.commentId; // Get the CommentID from the URL parameter

        const sql = `SELECT COUNT(*) AS Likes FROM CommentLikes WHERE CommentID = ?`;

        connection.query(sql, [commentId], (err, results) => {
            if (err) {
                console.error('Error retrieving forum likes:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.status(200).json(results); // Return the first result
        });

        // Close the connection
        connection.end();

    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});

router.post('/AddCommentLike', async function (req, res, next) {
    try {
        const connection = await connectToDB();
        const { CommentID, UserID } = req.body;

        const sql = `INSERT INTO CommentLikes (CommentID, UserID) VALUES (?, ?)`;

        connection.query(sql, [CommentID, UserID], (err, results) => {
            if (err) {
                console.error('Error adding like:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.status(200).json({ message: 'Like added successfully' });
        });

        // Close the connection
        connection.end();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});

router.put('/updateLike/:commentId', async function (req, res, next) {
    try {
        const connection = await connectToDB();
        const commentId = req.params.commentId; // Get the CommentID from the URL parameter

        const sql = `UPDATE ForumComment SET LikeNum = LikeNum + 1 WHERE CommentID = ?`;

        connection.query(sql, [commentId], (err, results) => {
            if (err) {
                console.error('Error updating like:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.status(200).json({ message: 'Like updated successfully' });
        });

        // Close the connection
        connection.end();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});

router.get('/CheckUserLikedComment/:userId/:commentId', async function (req, res, next) {
    try {
        const connection = await connectToDB();
        const userId = req.params.userId; // Get the UserID from the URL parameter
        const commentId = req.params.commentId; // Get the CommentID from the URL parameter

        const sql = `SELECT * FROM CommentLikes WHERE UserID = ? AND CommentID = ?`;

        connection.query(sql, [userId, commentId], (err, results) => {
            if (err) {
                console.error('Error retrieving like:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.status(200).json(results); // Return the results
        });

        // Close the connection (this should be in a finally block)
        connection.end();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});

router.delete('/DeleteCommentLike/:userId/:commentId', async function (req, res, next) {
    try {
        const connection = await connectToDB();
        const userId = req.params.userId; // Get the UserID from the URL parameter
        const commentId = req.params.commentId; // Get the CommentID from the URL parameter

        const sql = `DELETE FROM CommentLikes WHERE UserID = ? AND CommentID = ?`;

        connection.query(sql, [userId, commentId], (err, results) => {
            if (err) {
                console.error('Error deleting like:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.status(200).json({ message: 'Like deleted successfully' });
        });

        // Close the connection
        connection.end();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});

router.put('/updateLike_delete/:commentId', async function (req, res, next) {
    try {
        const connection = await connectToDB();
        const commentId = req.params.commentId; // Get the CommentID from the URL parameter

        const sql = `UPDATE ForumComment SET LikeNum = LikeNum - 1 WHERE CommentID = ?`;

        connection.query(sql, [commentId], (err, results) => {
            if (err) {
                console.error('Error updating like:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.status(200).json({ message: 'Like updated successfully' });
        });

        // Close the connection
        connection.end();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});


const upload = multer({
    limits: { fileSize: 100 * 1024 * 1024 } // 10MB limit
});

router.use(bodyParser.json({ limit: '100mb' }));
router.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

router.post('/CreateForum', upload.single('image'), async function (req, res, next) {

    try {
        const connection = await connectToDB();
        const { UserID, CourseID, ForumTitle, Description } = req.body;

        const sql = `INSERT INTO Forum (UserID, CourseID, ForumTitle, Description, UpdatedTime, LastUpdated) VALUES (?, ?, ?, ?, NOW(), NOW())`;

        connection.query(sql, [UserID, CourseID, ForumTitle, Description], (err, results) => {
            if (err) {
                console.error('Error adding forum:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.status(200).json({ message: 'Forum added successfully' });
        });

        // Close the connection
        connection.end();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});

// Catch multer errors
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(413).send({ error: err.message });
    }
    next(err);
});




router.post('/CreateForumWithVideo', async function (req, res, next) {

    let VideoTitle = req.file ? req.file.filename : null;
    // Set up storage for uploaded files
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/'); // Specify the uploads directory
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
            const { UserID, CourseID, ForumTitle, Description } = req.body;
            const VideoPath = req.file ? req.file.path : null;
            const VidoType = req.file ? req.file.mimetype : null;

            // console.log('UserID:', UserID);
            // console.log('CourseID:', CourseID);
            // console.log('ForumTitle:', ForumTitle);
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

            // Step 3: Insert the Forum
            const sql3 = `INSERT INTO Forum (MediaID, UserID, CourseID, ForumTitle, Description, UpdatedTime, LastUpdated) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`;
            connection.query(sql3, [mediaId, UserID, CourseID, ForumTitle, Description]);

            res.status(200).json({ message: 'Forum with video created successfully' });

            // Close the connection
            connection.end();
        } catch (error) {
            console.error('Error creating forum with video:', error);
            res.status(500).send('Server error');
        }
    });
});

router.put('/CourseNumQuesstion/:CourseID', async function (req, res, next) {
    try {
        const connection = await connectToDB();
        const CourseID = req.params.CourseID; // Get the CourseID from the URL parameter

        const sql = `UPDATE Course SET ForumNum = ForumNum + 1 WHERE CourseID = ?`;

        connection.query(sql, [CourseID], (err, results) => {
            if (err) {
                console.error('Error updating course:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.status(200).json({ message: 'Course updated successfully' });
        });

        // Close the connection
        connection.end();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});

router.post('/CreateCourse', async function (req, res, next) {
    try {
        const connection = await connectToDB();
        const { CourseName, TeacherName, Semester, UserID } = req.body;

        const sql = `INSERT INTO Course (CourseName, TeacherName, Semester, UserID) VALUES (?, ?, ?, ?)`;

        connection.query(sql, [CourseName, TeacherName, Semester, UserID], (err, results) => {
            if (err) {
                console.error('Error adding course:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.status(200).json({ message: 'Course added successfully' });
        });

        // Close the connection
        connection.end();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Server error');
    }
});
module.exports = router;
