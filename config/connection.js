const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',  
    port: 3306,
    user: 'root',
    password: 'W@tbh03890389',
    database: 'office_DB',
  });

module.exports = connection;