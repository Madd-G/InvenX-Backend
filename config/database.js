const mysql = require('mysql');

const db = mysql.createPool({
    connectionLimit: 10,
    host: 'sql6.freemysqlhosting.net',
    user: 'sql6694145',
    password: 'jJh3SX7yGA',
    database: 'sql6694145',
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
