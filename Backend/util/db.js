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
        connectionLimit: 10, // Adjust this number based on your expected load
        queueLimit: 0,
        connectTimeout: 2000 // Connection timeout in milliseconds
    });

    // Connect to MySQL
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err.stack);
            return;
        }
        console.log('Connected to MySQL as id ' + connection.threadId);
    });

    return connection;


}


module.exports = { connectToDB };