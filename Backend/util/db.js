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
        connectTimeout: 1000, // Connection timeout in milliseconds
        idleTimeout: 1000, // Idle timeout in milliseconds
        keepAliveInitialDelay: 1000
    });

    // Function to clear all active MySQL connections
async function clearAllConnections(connection) {
    try {
        const [processlist] = await connection.query('SHOW PROCESSLIST;');
        
        // Iterate over the processes in the process list
        for (const row of processlist) {
            // You can decide to skip certain processes based on your requirements
            if (row.Id !== connection.threadId) { // Skip your own connection to avoid issues
                await connection.query(`KILL ${row.Id};`);
                console.log(`Killed process with ID: ${row.Id}`);
            }
        }
    } catch (error) {
        console.error('Error clearing connections:', error);
    }
}

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