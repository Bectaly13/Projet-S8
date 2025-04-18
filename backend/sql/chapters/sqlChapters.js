const mysqlConnect = require("../sqlConnect");
const chp = require("../sqlConfig").chp;

async function getChapters(domainId) {
    const query = `SELECT chapterId, name
        FROM ${chp}
        WHERE domainId = ?
        ORDER BY chapterId`;
        
    const data = [domainId];
    return mysqlConnect.query(query, data);
}

module.exports.getChapters = getChapters;