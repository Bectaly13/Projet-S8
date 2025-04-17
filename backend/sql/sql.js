const mysqlConnect = require("./sqlConnect");

async function getNom(numero) {
    const requete = `SELECT name
        FROM ${dom}
        WHERE domainId = ?`;
    const data = [numero];
    return mysqlConnect.query(requete, data);
}

module.exports.getNom = getNom;