var express = require('express');
var router = express.Router();
const { connectToDB } = require('../util/db');
const cors = require('cors')
const app = express();
app.use(cors());

router.get('/GetCourses/:userId', async function (req, res, next) {
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

router.get('/GetTop5Asking/:userId/:courseId/:duration', async (req, res) => {
    const { userId, courseId, duration } = req.params;

    const connection = await connectToDB(); // Use the updated function

    if (duration === 'month') {
        const query = `
            SELECT
                u.UserID,
                u.UserName,
                COUNT(q.QAID) AS question_count,
                ql.QueueListID,
                c.CourseName,
                (SELECT COUNT(*) FROM Queue_list WHERE CourseID = ? AND CreatorID = ?) AS total_count,
                COUNT(DISTINCT CASE WHEN ql_inner.CreatorID IS NOT NULL THEN ql_inner.QueueListID END) AS joined_count
            FROM
                User u
            JOIN
                Question q ON u.UserID = q.UserID
            JOIN
                Queue_list ql ON q.QueueListID = ql.QueueListID
            JOIN
                Course c ON ql.CourseID = c.CourseID
            LEFT JOIN
                Queue_list ql_inner ON ql_inner.CourseID = c.CourseID AND ql_inner.CreatorID = u.UserID
            WHERE
                u.UserID <> ?
            AND
                c.CourseID = ?
            AND
                q.UploadTime >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
            GROUP BY
                u.UserID,
                u.UserName,
                ql.QueueListID,
                c.CourseName
            ORDER BY
                question_count DESC
            LIMIT 5;
        `;

        try {
            connection.query(query, [courseId, userId, userId, courseId], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.status(200).json(results);
            });
        } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal server error' });
        } finally {
            connection.end(); // Ensure the connection is closed
        }
    } else if (duration === 'week') {
        const query = `
            SELECT
                u.UserID,
                u.UserName,
                COUNT(q.QAID) AS question_count,
                ql.QueueListID,
                c.CourseName,
                (SELECT COUNT(*) FROM Queue_list WHERE CourseID = ? AND CreatorID = ?) AS total_count,
                COUNT(DISTINCT CASE WHEN ql_inner.CreatorID IS NOT NULL THEN ql_inner.QueueListID END) AS joined_count
            FROM
                User u
            JOIN
                Question q ON u.UserID = q.UserID
            JOIN
                Queue_list ql ON q.QueueListID = ql.QueueListID
            JOIN
                Course c ON ql.CourseID = c.CourseID
            LEFT JOIN
                Queue_list ql_inner ON ql_inner.CourseID = c.CourseID AND ql_inner.CreatorID = u.UserID
            WHERE
                u.UserID <> ?
            AND
                c.CourseID = ?
            AND
                q.UploadTime >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
            GROUP BY
                u.UserID,
                u.UserName,
                ql.QueueListID,
                c.CourseName
            ORDER BY
                question_count DESC
            LIMIT 5;
        `;

        try {
            connection.query(query, [courseId, userId, userId, courseId], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.status(200).json(results);
            });
        } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal server error' });
        } finally {
            connection.end(); // Ensure the connection is closed
        }
    } else {

        const combinedQuery = `
            SELECT
                u.UserID,
                u.UserName,
                COUNT(q.QAID) AS question_count,
                ql.QueueListID,
                c.CourseName,
                (SELECT COUNT(*) FROM Queue_list WHERE CourseID = ? AND CreatorID = ?) AS total_count,
                COUNT(DISTINCT CASE WHEN ql_inner.CreatorID IS NOT NULL THEN ql_inner.QueueListID END) AS joined_count
            FROM
                User u
            JOIN
                Question q ON u.UserID = q.UserID
            JOIN
                Queue_list ql ON q.QueueListID = ql.QueueListID
            JOIN
                Course c ON ql.CourseID = c.CourseID
            LEFT JOIN
                Queue_list ql_inner ON ql_inner.CourseID = c.CourseID AND ql_inner.CreatorID = u.UserID
            WHERE
                u.UserID <> ?
            AND
                c.CourseID = ?
            GROUP BY
                u.UserID,
                u.UserName,
                ql.QueueListID,
                c.CourseName
            ORDER BY
                question_count DESC
            LIMIT 5;
    `;

        try {
            connection.query(combinedQuery, [courseId, userId, userId, courseId], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                //const Data = results.map(result => ({ UserID: result.UserID, joined_count: result.joined_count }));
                res.status(200).json(results);
            });
        } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal server error' });
        } finally {
            connection.end(); // Ensure the connection is closed
        }
    }
});

router.get('/GetEngagement/:userId/:courseId/:duration', async (req, res) => {
    const { userId, courseId, duration } = req.params;


    const connection = await connectToDB();

    if (duration === 'month') {
        const engagementQuery = `
        SELECT
            u.UserID,
            COUNT(DISTINCT ql.QueueListID) AS joined_count,
            c.CourseName
        FROM
            User u
        JOIN
            Question q ON u.UserID = q.UserID
        JOIN
            Queue_list ql ON q.QueueListID = ql.QueueListID
        JOIN
            Course c ON ql.CourseID = c.CourseID
        WHERE
            c.CourseID = ?
        AND
            q.UserID = ?
        AND
            q.UploadTime >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
        GROUP BY
            u.UserID,
            c.CourseName;
    `;
        try {
            connection.query(engagementQuery, [courseId, userId], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.status(200).json(results);
            });
        }
        catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal server error' });
        } finally {
            connection.end(); // Ensure the connection is closed
        }
    }
    else if (duration === 'week') {
        const engagementQuery = `
        SELECT
            u.UserID,
            COUNT(DISTINCT ql.QueueListID) AS joined_count,
            c.CourseName
        FROM
            User u
        JOIN
            Question q ON u.UserID = q.UserID
        JOIN
            Queue_list ql ON q.QueueListID = ql.QueueListID
        JOIN
            Course c ON ql.CourseID = c.CourseID
        WHERE
            c.CourseID = ?
        AND
            q.UserID = ?
        AND
            q.UploadTime >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
        GROUP BY
            u.UserID,
            c.CourseName;
    `;
        try {
            connection.query(engagementQuery, [courseId, userId], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.status(200).json(results);
            });
        }
        catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
        finally {
            connection.end(); // Ensure the connection is closed
        }
    }
    else {

        const engagementQuery = `
        SELECT
            u.UserID,
            COUNT(DISTINCT ql.QueueListID) AS joined_count,
            c.CourseName
        FROM
            User u
        JOIN
            Question q ON u.UserID = q.UserID
        JOIN
            Queue_list ql ON q.QueueListID = ql.QueueListID
        JOIN
            Course c ON ql.CourseID = c.CourseID
        WHERE
            c.CourseID = ?
        AND
            q.UserID = ?
        GROUP BY
            u.UserID,
            c.CourseName;
    `;

        try {
            connection.query(engagementQuery, [courseId, userId], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.status(200).json(results);
            });
        } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal server error' });
        } finally {
            connection.end(); // Ensure the connection is closed
        }
    }
});


router.get('/GetCategoryCount/:courseId/:duration', async (req, res) => {
    const { courseId, duration } = req.params;

    const connection = await connectToDB();

    if (duration === 'month') {
        const countQueries = {
            theory: `
                SELECT COUNT(q.QAID) AS count
                FROM Question q
                JOIN Queue_list ql ON q.QueueListID = ql.QueueListID
                WHERE q.Type = "Theory"
                AND ql.CourseID = ?
                AND q.UploadTime >= DATE_SUB(NOW(), INTERVAL 1 MONTH);
            `,
            labWork: `
                SELECT COUNT(q.QAID) AS count
                FROM Question q
                JOIN Queue_list ql ON q.QueueListID = ql.QueueListID
                WHERE q.Type = "lab-work"
                AND ql.CourseID = ?
                AND q.UploadTime >= DATE_SUB(NOW(), INTERVAL 1 MONTH);
            `,
            debugging: `
                SELECT COUNT(q.QAID) AS count
                FROM Question q
                JOIN Queue_list ql ON q.QueueListID = ql.QueueListID
                WHERE q.Type = "Debugging"
                AND ql.CourseID = ?
                AND q.UploadTime >= DATE_SUB(NOW(), INTERVAL 1 MONTH);
            `,
            assignments: `
                SELECT COUNT(q.QAID) AS count
                FROM Question q
                JOIN Queue_list ql ON q.QueueListID = ql.QueueListID
                WHERE q.Type = "Assignments"
                AND ql.CourseID = ?
                AND q.UploadTime >= DATE_SUB(NOW(), INTERVAL 1 MONTH);
            `
        };
        const results = await Promise.all([
            new Promise((resolve, reject) => {
                connection.query(countQueries.theory, [courseId], (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    console.log(results);
                    resolve(results[0] ? results[0].count : 0);
                });
            }
            ),
            new Promise((resolve, reject) => {
                connection.query(countQueries.labWork, [courseId], (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results[0].count);
                });
            }
            ),
            new Promise((resolve, reject) => {
                connection.query(countQueries.debugging, [courseId], (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results[0].count);
                });
            }
            ),
            new Promise((resolve, reject) => {
                connection.query(countQueries.assignments, [courseId], (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results[0].count);
                }
                )
            }
            )
        ]);

        const response = {
            theory: results[0],
            labWork: results[1],
            debugging: results[2],
            assignments: results[3]
        };
        res.status(200).json(response);
    } else if (duration === 'week') {
        const countQueries = {
            theory: `
                SELECT COUNT(q.QAID) AS count
                FROM Question q
                JOIN Queue_list ql ON q.QueueListID = ql.QueueListID
                WHERE q.Type = "Theory"
                AND ql.CourseID = ?
                AND q.UploadTime >= DATE_SUB(NOW(), INTERVAL 1 WEEK);
            `,
            labWork: `
                SELECT COUNT(q.QAID) AS count
                FROM Question q
                JOIN Queue_list ql ON q.QueueListID = ql.QueueListID
                WHERE q.Type = "lab-work"
                AND ql.CourseID = ?
                AND q.UploadTime >= DATE_SUB(NOW(), INTERVAL 1 WEEK);
            `,
            debugging: `
                SELECT COUNT(q.QAID) AS count
                FROM Question q
                JOIN Queue_list ql ON q.QueueListID = ql.QueueListID
                WHERE q.Type = "Debugging"
                AND ql.CourseID = ?
                AND q.UploadTime >= DATE_SUB(NOW(), INTERVAL 1 WEEK);
            `,
            assignments: `
                SELECT COUNT(q.QAID) AS count
                FROM Question q
                JOIN Queue_list ql ON q.QueueListID = ql.QueueListID
                WHERE q.Type = "Assignments"
                AND ql.CourseID = ?
                AND q.UploadTime >= DATE_SUB(NOW(), INTERVAL 1 WEEK);
            `
        };
        const results = await Promise.all([
            new Promise((resolve, reject) => {
                connection.query(countQueries.theory, [courseId], (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results[0].count);
                });
            }
            ),
            new Promise((resolve, reject) => {
                connection.query(countQueries.labWork, [courseId], (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results[0].count);
                });
            }
            ),
            new Promise((resolve, reject) => {
                connection.query(countQueries.debugging, [courseId], (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results[0].count);
                });
            }
            ),
            new Promise((resolve, reject) => {
                connection.query(countQueries.assignments, [courseId], (err, results) => {
                    if (err) {
                        reject(err
                        );
                    }
                    resolve(results[0].count);
                });
            }
            )
        ]);

        const response = {
            theory: results[0],
            labWork: results[1],
            debugging: results[2],
            assignments: results[3]
        };
        res.status(200).json(response);
    } else {

        const countQueries = {
            theory: `
            SELECT COUNT(q.QAID) AS count
            FROM Question q
            JOIN Queue_list ql ON q.QueueListID = ql.QueueListID
            WHERE q.Type = "Theory"
            AND ql.CourseID = ?;
        `,
            labWork: `
            SELECT COUNT(q.QAID) AS count
            FROM Question q
            JOIN Queue_list ql ON q.QueueListID = ql.QueueListID
            WHERE q.Type = "lab-work"
            AND ql.CourseID = ?;
        `,
            debugging: `
            SELECT COUNT(q.QAID) AS count
            FROM Question q
            JOIN Queue_list ql ON q.QueueListID = ql.QueueListID
            WHERE q.Type = "Debugging"
            AND ql.CourseID = ?;
        `,
            assignments: `
            SELECT COUNT(q.QAID) AS count
            FROM Question q
            JOIN Queue_list ql ON q.QueueListID = ql.QueueListID
            WHERE q.Type = "Assignments"
            AND ql.CourseID = ?;
        `
        };

        const results = await Promise.all([
            new Promise((resolve, reject) => {
                connection.query(countQueries.theory, [courseId], (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results[0].count);
                });
            }
            ),
            new Promise((resolve, reject) => {
                connection.query(countQueries.labWork, [courseId], (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results[0].count);
                });
            }
            ),
            new Promise((resolve, reject) => {
                connection.query(countQueries.debugging, [courseId], (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results[0].count);
                });
            }
            ),
            new Promise((resolve, reject) => {
                connection.query(countQueries.assignments, [courseId], (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results[0].count);
                });
            }
            )
        ]);
        const response = {
            theory: results[0],
            labWork: results[1],
            debugging: results[2],
            assignments: results[3]
        };
        res.status(200).json(response);
    }

    connection.end();
});



router.get('/getAnswer_QA_AvgTime/:UserID/:CourseID/:duration', async (req, res) => {
    try {
        const { UserID, CourseID, duration } = req.params;
        let avg_taketime = 0;
        let Num_Waiting = 0;
        if (!UserID) {
            return res.status(400).send('UserID is required');
        }

        const connection = await connectToDB();

        if (duration === 'month') {
            // Query to get the average TakeTime by UserID from Answer table
            const query = `
                SELECT AVG(a.TakeTime) AS avg_take_time
                FROM Answer a
                JOIN Question q ON a.QAID = q.QAID
                JOIN Queue_List ql ON q.QueueListID = ql.QueueListID
                WHERE a.UserID = ?
                AND ql.CourseID = ?
                AND a.UploadTime >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
                GROUP BY a.UserID
            `;
            const results = await new Promise((resolve, reject) => {
                connection.query(query, [UserID, CourseID], (error, results) => {
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
        } else if (duration === 'week') {
            // Query to get the average TakeTime by UserID from Answer table
            const query = `
                SELECT AVG(a.TakeTime) AS avg_take_time
                FROM Answer a
                JOIN Question q ON a.QAID = q.QAID
                JOIN Queue_List ql ON q.QueueListID = ql.QueueListID
                WHERE a.UserID = ?
                AND ql.CourseID = ?
                AND a.UploadTime >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
                GROUP BY a.UserID
            `;
            const results = await new Promise((resolve, reject) => {
                connection.query(query, [UserID, CourseID], (error, results) => {
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
        } else {

            // Query to get the average TakeTime by UserID from Answer table
            const query = `
            SELECT AVG(a.TakeTime) AS avg_take_time
            FROM Answer a
            JOIN Question q ON a.QAID = q.QAID
            JOIN Queue_List ql ON q.QueueListID = ql.QueueListID
            WHERE a.UserID = ?
            AND ql.CourseID = ?
            GROUP BY a.UserID
        `;
            const results = await new Promise((resolve, reject) => {
                connection.query(query, [UserID, CourseID], (error, results) => {
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
        }
    } catch (error) {
        console.error('Error retrieving TakeTime:', error);
        res.status(500).send('Server error');
    }
});

router.get('/GetNumAns/:UserID/:CourseID/:duration', async (req, res) => {
    try {
        const { UserID, CourseID,duration } = req.params;

        if (!UserID || !CourseID) {
            return res.status(400).send('UserID and CourseID are required');
        }

        const connection = await connectToDB();

        if (duration === 'month') {
            const query = `
            SELECT COUNT(a.ASID) AS Answer_Count
            FROM Answer a
            JOIN Question q ON a.QAID = q.QAID
            JOIN Queue_List ql ON q.QueueListID = ql.QueueListID
            WHERE a.UserID = ?
            AND ql.CourseID = ?
            AND a.UploadTime >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
            GROUP BY a.UserID;
        `;

            connection.query(query, [UserID, CourseID], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                const response = results.length > 0 ? results[0] : { Answer_Count: 0 };
                res.status(200).json(response);
            });

            connection.end();
        }
        else if (duration === 'week') {
            const query = `
            SELECT COUNT(a.ASID) AS Answer_Count
            FROM Answer a
            JOIN Question q ON a.QAID = q.QAID
            JOIN Queue_List ql ON q.QueueListID = ql.QueueListID
            WHERE a.UserID = ?
            AND ql.CourseID = ?
            AND a.UploadTime >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
            GROUP BY a.UserID;
        `;

            connection.query(query, [UserID, CourseID], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                const response = results.length > 0 ? results[0] : { Answer_Count: 0 };
                res.status(200).json(response);
            });

            connection.end();
        }
        else {
            const query = `
            SELECT COUNT(a.ASID) AS Answer_Count
            FROM Answer a
            JOIN Question q ON a.QAID = q.QAID
            JOIN Queue_List ql ON q.QueueListID = ql.QueueListID
            WHERE a.UserID = ?
            AND ql.CourseID = ?
            GROUP BY a.UserID;
        `;

            connection.query(query, [UserID, CourseID], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                const response = results.length > 0 ? results[0] : { Answer_Count: 0 };
                res.status(200).json(response);
            });

            connection.end();
        }

    } catch (error) {
        console.error('Error retrieving Answer Count:', error);
        res.status(500).send('Server error');
    }
});

router.get('/GetQuestionTimes/:CourseID/:duration', async (req, res) => {
    try {
        const { CourseID,duration } = req.params;

        if (!CourseID) {
            return res.status(400).send('CourseID is required');
        }

        const connection = await connectToDB();


        if (duration === 'month') {
            const query = `
            SELECT ql.CourseWeek, COUNT(q.QAID) AS QuestionCount, MAX(ql.Created) AS LastUploadTime
            FROM queue_list ql
            LEFT JOIN question q ON ql.QueueListID = q.QueueListID
            WHERE ql.CourseID = ?
            AND q.UploadTime >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
            GROUP BY ql.CourseWeek;
        `;

            connection.query(query, [CourseID], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                res.status(200).json(results);
            });

            connection.end();
        }
        else if (duration === 'week') {
            const query = `
            SELECT ql.CourseWeek, COUNT(q.QAID) AS QuestionCount, MAX(ql.Created) AS LastUploadTime
            FROM queue_list ql
            LEFT JOIN question q ON ql.QueueListID = q.QueueListID
            WHERE ql.CourseID = ?
            AND q.UploadTime >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
            GROUP BY ql.CourseWeek;
        `;

            connection.query(query, [CourseID], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                res.status(200).json(results);
            });

            connection.end();
        }
        else {
            const query = `
            SELECT ql.CourseWeek, COUNT(q.QAID) AS QuestionCount, MAX(ql.Created) AS LastUploadTime
            FROM queue_list ql
            LEFT JOIN question q ON ql.QueueListID = q.QueueListID
            WHERE ql.CourseID = ?
            GROUP BY ql.CourseWeek;
        `;

            connection.query(query, [CourseID], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                res.status(200).json(results);
            });

            connection.end();
        }

    } catch (error) {
        console.error('Error retrieving question times:', error);
        res.status(500).send('Server error');
    }
});


module.exports = router;
