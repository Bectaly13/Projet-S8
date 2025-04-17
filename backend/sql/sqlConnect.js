const sql = require('./sqlConfig');
const mysql = require('mysql2');

let db=0;

function connect(){
    db = mysql.createConnection({
        host     : sql.config.sqlHost,
        user     : sql.config.sqlLogin,   
        password : sql.config.sqlPassword,       
        database : sql.config.sqlDatabase
  });
}

function query(requete, data) {
    return new Promise((resolve, reject) => {
        db.query(
            requete,
            data,
            (error, results) => {
                if (error) reject(error);
                else resolve(results);    
            }
        );
    });
}

connect();

module.exports.query = query;