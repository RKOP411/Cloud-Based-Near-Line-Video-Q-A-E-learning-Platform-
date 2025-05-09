const mysql = require('mysql2');

// Connect to MongoDB
async function connectToDB() {
    const connection = mysql.createConnection({
        host: 'localhost', // Your database host
        user: 'root',      // Your database username
        password: 'root12', // Your database password
        database: 'LearnPlatform',
        multipleStatements: true,
        waitForConnections: true,
        connectionLimit: 8, // Adjust this number based on your expected load
        queueLimit: 0,
        connectTimeout: 100, // Connection timeout in milliseconds
        idleTimeout: 1, // Idle timeout in milliseconds
        keepAliveInitialDelay: 1
    });



    // Connect to MySQL
    connection.connect((err) => {

        connection.query('SELECT CONCAT("KILL ", id, ";") AS kill_command FROM INFORMATION_SCHEMA.PROCESSLIST WHERE COMMAND = "Sleep" AND Time >= 10;', (err, results) => {
            if (err) {
                console.error('Error fetching sleep connections:', err);
                return;
            }
            results.forEach(row => {
                connection.query(row.kill_command, (err) => {
                    if (err) {
                        console.error('Error killing connection:', err);
                    } else {
                        console.log('Killed connection:', row.kill_command);
                    }
                });
            });

            // Check for errors
            if (err) {
                console.error('Error connecting to MySQL:', err.stack);
                return;
            }
            console.log('Connected to MySQL as id ' + connection.threadId);
        });
    });

    return connection;


}




module.exports = { connectToDB };