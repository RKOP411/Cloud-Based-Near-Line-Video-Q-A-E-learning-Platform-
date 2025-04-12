const mysql = require('mysql2');

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost', // Your database host
    user: 'root',      // Your database username
    password: 'root12', // Your database password
    database: 'LearnPlatform',
    waitForConnections: true,
    connectionLimit: 8, // Adjust this number based on your expected load
    queueLimit: 0
});

// Function to get a connection from the pool
async function connectToDB() {
    return pool.promise(); // Use promise-based pool for async/await
}

module.exports = { connectToDB };
