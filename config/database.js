const mysql = require('mysql');

const db = mysql.createPool({
    connectionLimit: 10,
    host: 'sql12.freesqldatabase.com',
    user: 'sql12805853',
    password: 'kd3k989Y5K',
    database: 'sql12805853',
    waitForConnections: true,
    queueLimit: 0,
    connectTimeout: 10000,
    acquireTimeout: 10000,
    timeout: 60000,
    multipleStatements: true 
});

db.on('connection', function (connection) {
    console.log('New connection established:', connection.threadId);
});

db.on('error', function (err) {
    console.error('Database error:', err);
});

db.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});

db.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
});

db.on('enqueue', function () {
    console.log('Waiting for available connection slot');
});

module.exports = db;
