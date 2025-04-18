const mysqlConnect = require("./sqlConnect");
const sct = require("./sqlConfig").sct;

async function getSectors() {
    const query = `SELECT sectorId, name
        FROM ${sct}
        ORDER BY sectorId`;
        
    const data = [];
    return mysqlConnect.query(query, data);
}

async function getSectorName(sectorId) {
    const query = `SELECT name
        FROM ${sct}
        WHERE sectorId = ?`;
    
    const data = [sectorId];
    return mysqlConnect.query(query, data);
}

module.exports.getSectors = getSectors;
module.exports.getSectorName = getSectorName;