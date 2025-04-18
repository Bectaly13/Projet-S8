const mysqlConnect = require("../sqlConnect");
const sct = require("../sqlConfig").sct;

async function getSectors() {
    const requete = `SELECT sectorId, name
        FROM ${sct}
        ORDER BY sectorId`;
        
    const data = [];
    return mysqlConnect.query(requete, data);
}

async function getSectorName(sectorId) {
    const requete = `SELECT name
        FROM ${sct}
        WHERE sectorId = ?`;
    
    const data = [sectorId];
    return mysqlConnect.query(requete, data);
}

module.exports.getSectors = getSectors;
module.exports.getSectorName = getSectorName;