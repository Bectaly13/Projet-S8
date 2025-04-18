const mysqlConnect = require("../sqlConnect");
const sct = require("../sqlConfig").sct;

async function getSectors() {
    const requete = `SELECT name
        FROM ${sct}
        ORDER BY sectorId`;
        
    const data = [];
    return mysqlConnect.query(requete, data);
}

module.exports.getSectors = getSectors;