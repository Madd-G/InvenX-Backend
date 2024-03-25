const mysql = require('mysql');

console.log(mysql.createConnection);

const db = mysql.createConnection({
    host: 'sql6.freemysqlhosting.net',
    user: 'sql6694145',
    password: 'jJh3SX7yGA',
    database: 'sql6694145'
});

console.log("User:", db.config.user);
console.log("Password:", db.config.password);
console.log("Database:", db.config.database);

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database as ID ' + db.threadId);
});

module.exports = db;
