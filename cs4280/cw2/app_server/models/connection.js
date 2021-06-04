var mysql = require('mysql');
var env = require('../../env');

var connection = mysql.createConnection({
    host: env.MYSQLHOST,
    port: process.env.MYSQLPORT || env.MYSQLPORT,
    user: env.MYSQLUSER,
    password: env.MYSQLPWD,
    database: env.MYSQLDB
});

connection.connect((err)=>{
    if(err) throw err;
});

module.exports = connection;