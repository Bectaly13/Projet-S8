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

// We connect to the database
connect();

module.exports.query = query;