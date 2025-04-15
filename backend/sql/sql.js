const config = require("./sqlConfig");
const mysqlConnect = require("./sqlConnect");

async function getNom(numero) {
    const requete = `SELECT *
        FROM userTypes
        WHERE userTypeId = ?`;
    const data = [numero];
    return mysqlConnect.query(requete, data);
}

module.exports.getNom = getNom;