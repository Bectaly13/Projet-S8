const config = require('./sqlConfig').config; // This contains the database's credentials.
const mysql = require('mysql2');

let db = 0;

// We use config data to connect to the database.
function connect(){
    db = mysql.createConnection({
        host     : config.sqlHost,
        user     : config.sqlLogin,   
        password : config.sqlPassword,       
        database : config.sqlDatabase
  });
}

// This is how SQL queries are interpreted.
// Since these are prepared statements, queries and data arrays are dissiocated.
function query(query, data) {
    // We connect to the database if we not connected
    if (db==0) connect();
    return new Promise((resolve, reject) => {
        db.query(
            query,
            data,
            (error, results) => {
                if (error) reject(error);
                else resolve(results);    
            }
        );
    });
}

function deconnect(){
    db.end();
    db==0
}


module.exports.query = query;
module.exports.deconnect=deconnect;