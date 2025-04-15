const config = require('./sqlConfig');
const mysql = require('mysql2');

let db=0;

function connect(){
    db = mysql.createConnection({
        host     : config.sqlHost,
        user     : config.sqlLogin,   
        password : config.sqlPassword,       
        database : config.sqlDatabase
  });
}

function disconnect(){
    db.end();
}

function status() {
    db.ping((err) => {
        if (err) {
            console.log("État de la connexion : déconnecté", err.message);
        } else {
            console.log("État de la connexion : connecté");
        }
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
module.exports.connect = connect;
module.exports.disconnect = disconnect;
module.exports.status = status;