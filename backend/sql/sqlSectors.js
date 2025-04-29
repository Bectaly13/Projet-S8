const mysqlConnect = require("./sqlConnect");
const sct = require("./sqlConfig").sct;

async function getSectors() {
    // We get all the sectors name and ID.
    const query = `SELECT sectorId, name
        FROM ${sct}
        ORDER BY sectorId`;
        
    const data = [];
    return mysqlConnect.query(query, data);
}

module.exports.getSectors = getSectors;