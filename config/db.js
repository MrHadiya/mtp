
var db_config = require('./config');

var mysql = require("mysql");
var confData = {
    multipleStatements: true,
    host: 'travelpocket.c9nicor5witl.ap-northeast-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Travelpocket2023',
    database: 'travel_pocket',
    connectionLimit: 1000,
    connectTimeout: 60 * 60 * 1000,
    acquireTimeout: 60 * 60 * 1000,
    timeout: 60 * 60 * 1000,

}

var connection = mysql.createConnection(confData);

connection.connect(function (err) {
    if (err) throw err;
    console.log('succ => db connect')
})

// var connection = mysql.createPool(function (err) {
//         if (err) throw err;
//         console.log('succ => db connect')
//     });

module.exports = connection;
