var express = require('express');
var router = express.Router();
const { connectToDB } = require('../util/db');
const cors = require('cors')
const app = express();
app.use(cors());


//============================================Teacher Dashboard ** Time-Based Performance Analysis - helps assess user activity ===============================================================
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
            MONTH(q.UploadTime) = MONTH(CURRENT_DATE())
            AND
            YEAR(q.UploadTime) = YEAR(CURRENT_DATE())
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
            YEARWEEK(q.UploadTime, 1) = YEARWEEK(CURDATE(), 1)
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

router.get('/GetAllAsking/:UserID/:CourseID/:duration', async (req, res) => {
    const { UserID, CourseID, duration } = req.params;

    const connection = await connectToDB();

    let query = `
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
    `;

    if (duration === 'month') {
        query += `
            AND MONTH(q.UploadTime) = MONTH(CURRENT_DATE())
            AND YEAR(q.UploadTime) = YEAR(CURRENT_DATE())
        `;
    } else if (duration === 'week') {
        query += `
            AND YEARWEEK(q.UploadTime, 1) = YEARWEEK(CURDATE(), 1)
        `;
    }

    query += `
        GROUP BY
        u.UserID,
        u.UserName,
        ql.QueueListID,
        c.CourseName
        ORDER BY
        question_count DESC;
    `;

    try {
        connection.query(query, [CourseID, UserID, UserID, CourseID], (err, results) => {
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
            MONTH(q.UploadTime) = MONTH(CURRENT_DATE())
        AND
            YEAR(q.UploadTime) = YEAR(CURRENT_DATE())
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
            YEARWEEK(q.UploadTime, 1) = YEARWEEK(CURDATE(), 1)
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
            AND MONTH(q.UploadTime) = MONTH(CURRENT_DATE())
            AND YEAR(q.UploadTime) = YEAR(CURRENT_DATE());
            `,
            labWork: `
            SELECT COUNT(q.QAID) AS count
            FROM Question q
            JOIN Queue_list ql ON q.QueueListID = ql.QueueListID
            WHERE q.Type = "lab-work"
            AND ql.CourseID = ?
            AND MONTH(q.UploadTime) = MONTH(CURRENT_DATE())
            AND YEAR(q.UploadTime) = YEAR(CURRENT_DATE());
            `,
            debugging: `
            SELECT COUNT(q.QAID) AS count
            FROM Question q
            JOIN Queue_list ql ON q.QueueListID = ql.QueueListID
            WHERE q.Type = "Debugging"
            AND ql.CourseID = ?
            AND MONTH(q.UploadTime) = MONTH(CURRENT_DATE())
            AND YEAR(q.UploadTime) = YEAR(CURRENT_DATE());
            `,
            assignments: `
            SELECT COUNT(q.QAID) AS count
            FROM Question q
            JOIN Queue_list ql ON q.QueueListID = ql.QueueListID
            WHERE q.Type = "Assignments"
            AND ql.CourseID = ?
            AND MONTH(q.UploadTime) = MONTH(CURRENT_DATE())
            AND YEAR(q.UploadTime) = YEAR(CURRENT_DATE());
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
                    resolve(results[0] ? results[0].count : 0); // Default to 0 if no rows are returned
                });
            }
            ),
            new Promise((resolve, reject) => {
                connection.query(countQueries.debugging, [courseId], (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results[0] ? results[0].count : 0);
                });
            }
            ),
            new Promise((resolve, reject) => {
                connection.query(countQueries.assignments, [courseId], (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results[0] ? results[0].count : 0);
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
            AND q.UploadTime >= CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY;
            `,
            labWork: `
            SELECT COUNT(q.QAID) AS count
            FROM Question q
            JOIN Queue_list ql ON q.QueueListID = ql.QueueListID
            WHERE q.Type = "lab-work"
            AND ql.CourseID = ?
            AND q.UploadTime >= CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY;
            `,
            debugging: `
            SELECT COUNT(q.QAID) AS count
            FROM Question q
            JOIN Queue_list ql ON q.QueueListID = ql.QueueListID
            WHERE q.Type = "Debugging"
            AND ql.CourseID = ?
            AND q.UploadTime >= CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY;
            `,
            assignments: `
            SELECT COUNT(q.QAID) AS count
            FROM Question q
            JOIN Queue_list ql ON q.QueueListID = ql.QueueListID
            WHERE q.Type = "Assignments"
            AND ql.CourseID = ?
            AND q.UploadTime >= CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY;
            `
        };
        const results = await Promise.all([
            new Promise((resolve, reject) => {
                connection.query(countQueries.theory, [courseId], (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results[0] ? results[0].count : 0);
                });
            }
            ),
            new Promise((resolve, reject) => {
                connection.query(countQueries.labWork, [courseId], (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results[0] ? results[0].count : 0);
                });
            }
            ),
            new Promise((resolve, reject) => {
                connection.query(countQueries.debugging, [courseId], (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results[0] ? results[0].count : 0);
                });
            }
            ),
            new Promise((resolve, reject) => {
                connection.query(countQueries.assignments, [courseId], (err, results) => {
                    if (err) {
                        reject(err
                        );
                    }
                    resolve(results[0] ? results[0].count : 0);
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
                    resolve(results[0] ? results[0].count : 0);
                });
            }
            ),
            new Promise((resolve, reject) => {
                connection.query(countQueries.labWork, [courseId], (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results[0] ? results[0].count : 0);
                });
            }
            ),
            new Promise((resolve, reject) => {
                connection.query(countQueries.debugging, [courseId], (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results[0] ? results[0].count : 0);
                });
            }
            ),
            new Promise((resolve, reject) => {
                connection.query(countQueries.assignments, [courseId], (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results[0] ? results[0].count : 0);
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
                AND MONTH(a.UploadTime) = MONTH(CURRENT_DATE())
                AND YEAR(a.UploadTime) = YEAR(CURRENT_DATE())
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
                AND YEARWEEK(a.UploadTime, 1) = YEARWEEK(CURDATE(), 1)
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
        const { UserID, CourseID, duration } = req.params;

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
            AND MONTH(a.UploadTime) = MONTH(CURRENT_DATE())
            AND YEAR(a.UploadTime) = YEAR(CURRENT_DATE())
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
            AND a.UploadTime >= CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY
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
        const { CourseID, duration } = req.params;

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
            AND q.UploadTime >= CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY
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

router.get('/GetQuestionPerTimes/:CourseID/:duration', async (req, res) => {
    try {
        const { CourseID, duration } = req.params;

        if (!CourseID) {
            return res.status(400).send('CourseID is required');
        }

        const connection = await connectToDB();

        if (duration == "month") {

            const ThisMonthQuestion = `SELECT q.*
                FROM Question q
                JOIN queue_list ql ON q.QueueListID = ql.QueueListID
                WHERE ql.CourseID = ?
                AND MONTH(q.UploadTime) = MONTH(CURDATE()) 
                AND YEAR(q.UploadTime) = YEAR(CURDATE());`

            const ThisMonthAnswer = `
                SELECT q.QAID,
                    MAX(a.UserID) AS UserID,
                    MAX(a.Text) AS Text,          
                    MAX(a.UploadTime) AS UploadTime,
                    SUM(a.TakeTime) AS TotalTakeTime,
                    qu.CourseID
                FROM Answer a
                JOIN Question q ON a.QAID = q.QAID
                JOIN queue_list qu ON q.QueueListID = qu.QueueListID
                WHERE qu.CourseID = ?
                AND MONTH(q.UploadTime) = MONTH(CURDATE()) 
                AND YEAR(q.UploadTime) = YEAR(CURDATE()) 
                GROUP BY q.QAID, qu.CourseID;`

            const results = await Promise.all([
                new Promise((resolve, reject) => {
                    connection.query(ThisMonthQuestion, [CourseID], (err, results) => {
                        if (err) return reject(err);
                        resolve(results);
                    });
                }),
                new Promise((resolve, reject) => {
                    connection.query(ThisMonthAnswer, [CourseID], (err, results) => {
                        if (err) return reject(err);
                        resolve(results);
                    });
                })
            ]);
            const response = {
                ThisMonthQuestion: results[0],
                ThisMonthAnswer: results[1]
            };
            res.status(200).json(response);
        }
        else if (duration == "week") {
            const ThisWeekQuestion = `SELECT q.*
            FROM Question q
            JOIN queue_list ql ON q.QueueListID = ql.QueueListID
            WHERE ql.CourseID = ?
            AND q.UploadTime >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
            AND q.UploadTime < DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 7 DAY);`

            const ThisWeekAnswer = `SELECT q.QAID,
            MAX(a.UserID) AS UserID,
            MAX(a.Text) AS Text,          
            MAX(a.UploadTime) AS UploadTime,
            SUM(a.TakeTime) AS TotalTakeTime,
            qu.CourseID
            FROM Answer a
            JOIN Question q ON a.QAID = q.QAID
            JOIN queue_list qu ON q.QueueListID = qu.QueueListID
            WHERE qu.CourseID = ?
            AND a.UploadTime >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
            AND a.UploadTime < DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 7 DAY)
            GROUP BY q.QAID, qu.CourseID;`


            const results = await Promise.all([
                new Promise((resolve, reject) => {
                    connection.query(ThisWeekQuestion, [CourseID], (err, results) => {
                        if (err) return reject(err);
                        resolve(results);
                    });
                }),
                new Promise((resolve, reject) => {
                    connection.query(ThisWeekAnswer, [CourseID], (err, results) => {
                        if (err) return reject(err);
                        resolve(results);
                    });
                })
            ]);
            const response = {
                ThisWeekQuestion: results[0],
                ThisWeekAnswer: results[1]
            };
            res.status(200).json(response);
        } else {



            const query = `
                WITH MonthlyQuestionCount AS (
                    SELECT
                        DATE_FORMAT(q.UploadTime, '%b') AS Time,
                        COUNT(q.QAID) AS QuestionCount
                    FROM
                        Question q
                    JOIN
                        queue_list ql ON q.QueueListID = ql.QueueListID
                    WHERE
                        ql.CourseID = ?
                    GROUP BY
                        DATE_FORMAT(q.UploadTime, '%b')
                ),

                AllMonths AS (
                    SELECT 'Jan' AS Month
                    UNION SELECT 'Feb'
                    UNION SELECT 'Mar'
                    UNION SELECT 'Apr'
                    UNION SELECT 'May'
                    UNION SELECT 'Jun'
                    UNION SELECT 'Jul'
                    UNION SELECT 'Aug'
                    UNION SELECT 'Sep'
                    UNION SELECT 'Oct'
                    UNION SELECT 'Nov'
                    UNION SELECT 'Dec'
                )

                SELECT
                    am.Month AS Time,
                    COALESCE(mq.QuestionCount, 0) AS QuestionCount,
                    COALESCE(a.AnswerCount, 0) AS AnswerGetCount
                FROM
                    AllMonths am
                LEFT JOIN MonthlyQuestionCount mq ON am.Month = mq.Time
                LEFT JOIN (
                    SELECT
                        DATE_FORMAT(q.UploadTime, '%b') AS Month,
                        COUNT(DISTINCT a.QAID) AS AnswerCount
                    FROM
                        Question q
                    JOIN
                        queue_list ql ON q.QueueListID = ql.QueueListID
                    LEFT JOIN Answer a ON q.QAID = a.QAID
                    WHERE
                        ql.CourseID = ?
                    GROUP BY
                        DATE_FORMAT(q.UploadTime, '%b')
                ) a ON am.Month = a.Month
                ORDER BY
                    FIELD(am.Month, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
                            `;

            connection.query(query, [CourseID, CourseID], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.status(200).json(results);
            });
        }


        connection.end();
    } catch (error) {
        console.error('Error retrieving question times:', error);
        res.status(500).send('Server error');
    }
});




//=================================================Student Dashboard - Comparative Temporal Performance Analysis=======================================================================================================
router.get('/stu/GetDashboradQuestions/:UserID/:duration', async (req, res) => {
    try {
        const { UserID, duration } = req.params;

        if (!UserID) {
            return res.status(400).send('UserID is required');
        }

        const connection = await connectToDB();
        if (duration == "month") {
            const query = `
            SELECT COUNT(QAID) AS QuestionCount
            FROM Question
            WHERE UserID = ?
            AND UploadTime >= DATE_FORMAT(NOW(), '%Y-%m-01');
        `;
            connection.query(query, [UserID], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                const response = results.length > 0 ? results : [];
                res.status(200).json(response);
            });
        }
        else if (duration == "week") {
            const query = `
                SELECT COUNT(QAID) AS QuestionCount
                FROM Question
                WHERE UserID = ?
                AND YEARWEEK(UploadTime, 1) = YEARWEEK(NOW(), 1);
            `;
            connection.query(query, [UserID], (err, results) => {
                if (err) {

                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                const response = results.length > 0 ? results : [];
                res.status(200).json(response);
            });
        } else {
            const query = `
                SELECT COUNT(QAID) AS QuestionCount
                FROM Question
                WHERE UserID = ?;
        `;

            connection.query(query, [UserID], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                const response = results.length > 0 ? results[0] : { QuestionCount: 0 };
                res.status(200).json(response);
            });
        }

        connection.end();
    } catch (error) {
        console.error('Error retrieving question count:', error);
        res.status(500).send('Server error');
    }
});

router.get('/stu/AnswerGetTotal/:UserID/:duration', async (req, res) => {
    try {
        const { UserID, duration } = req.params;

        if (!UserID) {
            return res.status(400).send('UserID is required');
        }

        const connection = await connectToDB();

        // const query = `
        //     SELECT COUNT(DISTINCT q.QAID) AS AnswerGetCount
        //     FROM question q
        //     JOIN answer a ON q.QAID = a.QAID
        //     WHERE q.UserID = ?;
        // `;

        if (duration == "month") {
            const query = `
            SELECT COUNT(DISTINCT q.QAID) AS AnswerGetCount
            FROM question q
            JOIN answer a ON q.QAID = a.QAID
            WHERE q.UserID = ?
            AND a.UploadTime >= DATE_FORMAT(NOW(), '%Y-%m-01');
        `;
            connection.query(query, [UserID], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                const response = results.length > 0 ? results[0] : { AnswerGetCount: 0 };
                res.status(200).json(response);
            });
        }
        else if (duration == "week") {
            const query = `
                SELECT COUNT(DISTINCT q.QAID) AS AnswerGetCount
                FROM question q
                JOIN answer a ON q.QAID = a.QAID
                WHERE q.UserID = ?
                AND YEARWEEK(a.UploadTime, 1) = YEARWEEK(NOW(), 1);
            `;
            connection.query(query, [UserID], (err, results) => {
                if (err) {

                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                const response = results.length > 0 ? results[0] : { AnswerGetCount: 0 };
                res.status(200).json(response);
            });
        }
        else {
            const query = `
                SELECT COUNT(DISTINCT q.QAID) AS AnswerGetCount
                FROM question q
                JOIN answer a ON q.QAID = a.QAID
                WHERE q.UserID = ?;
        `;


            connection.query(query, [UserID], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                const response = results.length > 0 ? results[0] : { AnswerGetCount: 0 };
                res.status(200).json(response);
            });
        }
        connection.end();
    } catch (error) {
        console.error('Error retrieving answer count:', error);
        res.status(500).send('Server error');
    }
});

router.get('/stu/AvgWaitingTime/:UserID/:duration', async (req, res) => {
    try {
        const { UserID, duration } = req.params;

        if (!UserID) {
            return res.status(400).send('UserID is required');
        }

        const connection = await connectToDB();
        if (duration == "month") {
            const query = `
            SELECT AVG(WaitingTime) AS AverageWaitingTime
            FROM (
                SELECT MIN(TIMESTAMPDIFF(SECOND, q.UploadTime, a.UploadTime)) AS WaitingTime
                FROM question q
                JOIN answer a ON q.QAID = a.QAID
                WHERE q.UserID = ?
                AND a.UploadTime >= DATE_FORMAT(NOW(), '%Y-%m-01')
                GROUP BY q.QAID
            ) AS Subquery;
        `;
            connection.query(query, [UserID], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                const response = results.length > 0 ? results[0] : { AverageWaitingTime: null };
                res.status(200).json(response);
            });
        }
        else if (duration == "week") {
            const query = `
            SELECT AVG(WaitingTime) AS AverageWaitingTime
            FROM (
                SELECT MIN(TIMESTAMPDIFF(SECOND, q.UploadTime, a.UploadTime)) AS WaitingTime
                FROM question q
                JOIN answer a ON q.QAID = a.QAID
                WHERE q.UserID = ?
                AND YEARWEEK(a.UploadTime, 1) = YEARWEEK(NOW(), 1)
                GROUP BY q.QAID
            ) AS Subquery;
        `;
            connection.query(query, [UserID], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                const response = results.length > 0 ? results[0] : { AverageWaitingTime: null };
                res.status(200).json(response);
            });
        }
        else {
            const query = `
            SELECT AVG(WaitingTime) AS AverageWaitingTime
            FROM (
                SELECT MIN(TIMESTAMPDIFF(SECOND, q.UploadTime, a.UploadTime)) AS WaitingTime
                FROM question q
                JOIN answer a ON q.QAID = a.QAID
                WHERE q.UserID = ?
                GROUP BY q.QAID
            ) AS Subquery;
        `;

            connection.query(query, [UserID], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                const response = results.length > 0 ? results[0] : { AverageWaitingTime: null };
                res.status(200).json(response);
            });
        }
        connection.end();
    } catch (error) {
        console.error('Error retrieving average waiting time:', error);
        res.status(500).send('Server error');
    }
});


router.get('/stu/MostTypeAsked/:UserID/:duration', async (req, res) => {
    try {
        const { UserID, duration } = req.params;

        if (!UserID) {
            return res.status(400).send('UserID is required');
        }

        const connection = await connectToDB();

        if (duration == "month") {
            const query = `
            SELECT 'Assignments' AS Type, 
                   COUNT(*) AS Count 
            FROM question 
            WHERE UserID = ? AND Type = 'Assignments' AND UploadTime >= DATE_FORMAT(NOW(), '%Y-%m-01')
            UNION ALL
            SELECT 'Theory', 
                   COUNT(*) 
            FROM question 
            WHERE UserID = ? AND Type = 'Theory' AND UploadTime >= DATE_FORMAT(NOW(), '%Y-%m-01')
            UNION ALL
            SELECT 'Lab-work', 
                   COUNT(*) 
            FROM question 
            WHERE UserID = ? AND Type = 'Lab-work' AND UploadTime >= DATE_FORMAT(NOW(), '%Y-%m-01')
            UNION ALL
            SELECT 'Debugging', 
                   COUNT(*) 
            FROM question 
            WHERE UserID = ? AND Type = 'Debugging' AND UploadTime >= DATE_FORMAT(NOW(), '%Y-%m-01');
        `;
            connection.query(query, [UserID, UserID, UserID, UserID], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.status(200).json(results);
            });
        }
        else if (duration == "week") {
            const query = `
            SELECT 'Assignments' AS Type, 
                   COUNT(*) AS Count 
            FROM question 
            WHERE UserID = ? AND Type = 'Assignments' AND YEARWEEK(UploadTime, 1) = YEARWEEK(NOW(), 1)
            UNION ALL
            SELECT 'Theory', 
                   COUNT(*) 
            FROM question 
            WHERE UserID = ? AND Type = 'Theory' AND YEARWEEK(UploadTime, 1) = YEARWEEK(NOW(), 1)
            UNION ALL
            SELECT 'Lab-work', 
                   COUNT(*) 
            FROM question 
            WHERE UserID = ? AND Type = 'Lab-work' AND YEARWEEK(UploadTime, 1) = YEARWEEK(NOW(), 1)
            UNION ALL
            SELECT 'Debugging', 
                   COUNT(*) 
            FROM question 
            WHERE UserID = ? AND Type = 'Debugging' AND YEARWEEK(UploadTime, 1) = YEARWEEK(NOW(), 1);
        `;
            connection.query(query, [UserID, UserID, UserID, UserID], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.status(200).json(results);
            });
        }
        else {
            const query = `
            SELECT 'Assignments' AS Type, 
                   COUNT(*) AS Count 
            FROM question 
            WHERE UserID = ? AND Type = 'Assignments'
            UNION ALL
            SELECT 'Theory', 
                   COUNT(*) 
            FROM question 
            WHERE UserID = ? AND Type = 'Theory'
            UNION ALL
            SELECT 'Lab-work', 
                   COUNT(*) 
            FROM question 
            WHERE UserID = ? AND Type = 'Lab-work'
            UNION ALL
            SELECT 'Debugging', 
                   COUNT(*) 
            FROM question 
            WHERE UserID = ? AND Type = 'Debugging';
        `;

            connection.query(query, [UserID, UserID, UserID, UserID], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                res.status(200).json(results);
            });
        }

        connection.end();
    } catch (error) {
        console.error('Error retrieving most asked types:', error);
        res.status(500).send('Server error');
    }
});

router.get('/stu/GetQuestionPerTime/:UserID/:duration', async (req, res) => {
    try {
        const { UserID, duration } = req.params;

        if (!UserID) {
            return res.status(400).send('UserID is required');
        }

        const connection = await connectToDB();

        if (duration == "month") {
            const ThisMonthQuestion = `SELECT q.*
                FROM Question q
                JOIN queue_list ql ON q.QueueListID = ql.QueueListID
                WHERE q.UserID = ?
                AND MONTH(q.UploadTime) = MONTH(CURDATE()) 
                AND YEAR(q.UploadTime) = YEAR(CURDATE());`

            const ThisMonthAnswer = `SELECT q.QAID,
                MAX(a.UserID) AS UserID,
                MAX(a.Text) AS Text,          
                MAX(a.UploadTime) AS UploadTime,
                SUM(a.TakeTime) AS TotalTakeTime,
                qu.CourseID,
                q.UserID AS QuestionUserID
                FROM Answer a
                JOIN Question q ON a.QAID = q.QAID
                JOIN queue_list qu ON q.QueueListID = qu.QueueListID
                WHERE q.UserID = ?
                AND MONTH(q.UploadTime) = MONTH(CURDATE()) 
                AND YEAR(q.UploadTime) = YEAR(CURDATE()) 
                GROUP BY q.QAID, qu.CourseID;`

            const results = await Promise.all([
                new Promise((resolve, reject) => {
                    connection.query(ThisMonthQuestion, [UserID], (err, results) => {
                        if (err) return reject(err);
                        resolve(results);
                    });
                }),
                new Promise((resolve, reject) => {
                    connection.query(ThisMonthAnswer, [UserID], (err, results) => {
                        if (err) return reject(err);
                        resolve(results);
                    });
                })
            ]);

            const response = {
                ThisMonthQuestion: results[0],
                ThisMonthAnswer: results[1]
            };
            res.status(200).json(response);
        }
        else if (duration == "week") {
            const ThisWeekQuestion = `SELECT q.*
                FROM Question q
                JOIN queue_list ql ON q.QueueListID = ql.QueueListID
                WHERE q.UserID = ?
                AND q.UploadTime >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
                AND q.UploadTime < DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 7 DAY);
                `

            const ThisWeekAnswer = `SELECT 
                q.QAID,
                MAX(a.UserID) AS UserID,
                MAX(a.Text) AS Text,          
                MAX(a.UploadTime) AS UploadTime,
                SUM(a.TakeTime) AS TotalTakeTime,
                qu.CourseID,
                q.UserID AS QuestionUserID
            FROM Answer a
            JOIN Question q ON a.QAID = q.QAID
            JOIN queue_list qu ON q.QueueListID = qu.QueueListID
            WHERE q.UserID = ?
            AND a.UploadTime >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) -- Monday of current week
            AND a.UploadTime < DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 7 DAY) -- Next Monday (exclusive)
            GROUP BY q.QAID, qu.CourseID, q.UserID;`

            const results = await Promise.all([
                new Promise((resolve, reject) => {
                    connection.query(ThisWeekQuestion, [UserID], (err, results) => {
                        if (err) return reject(err);
                        resolve(results);
                    });
                }),
                new Promise((resolve, reject) => {
                    connection.query(ThisWeekAnswer, [UserID], (err, results) => {
                        if (err) return reject(err);
                        resolve(results);
                    });
                })
            ]);
            const response = {
                ThisWeekQuestion: results[0],
                ThisWeekAnswer: results[1]
            };
            res.status(200).json(response);
        }
        else {
            const query = `
            WITH MonthlyQuestionCount AS (
                SELECT
                    DATE_FORMAT(UploadTime, '%b') AS Time,
                    COUNT(QAID) AS QuestionCount
                FROM
                    Question
                WHERE
                    UserID = ?
                GROUP BY
                    DATE_FORMAT(UploadTime, '%b')
            ),

            AllMonths AS (
                SELECT 'Jan' AS Month
                UNION SELECT 'Feb'
                UNION SELECT 'Mar'
                UNION SELECT 'Apr'
                UNION SELECT 'May'
                UNION SELECT 'Jun'
                UNION SELECT 'Jul'
                UNION SELECT 'Aug'
                UNION SELECT 'Sep'
                UNION SELECT 'Oct'
                UNION SELECT 'Nov'
                UNION SELECT 'Dec'
            )

            SELECT
                am.Month AS Time,
                COALESCE(mq.QuestionCount, 0) AS QuestionCount,
                COALESCE(a.AnswerCount, 0) AS AnswerGetCount
            FROM
                AllMonths am
            LEFT JOIN MonthlyQuestionCount mq ON am.Month = mq.Time
            LEFT JOIN (
                SELECT
                    DATE_FORMAT(q.UploadTime, '%b') AS Month,
                    COUNT(DISTINCT a.QAID) AS AnswerCount
                FROM
                    Question q
                LEFT JOIN Answer a ON q.QAID = a.QAID
                WHERE
                    q.UserID = ?
                GROUP BY
                    DATE_FORMAT(q.UploadTime, '%b')
            ) a ON am.Month = a.Month
            ORDER BY
                FIELD(am.Month, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
        `;

            connection.query(query, [UserID, UserID], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                res.status(200).json(results);
            });
        }
        connection.end();
    } catch (error) {
        console.error('Error retrieving questions per time:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
