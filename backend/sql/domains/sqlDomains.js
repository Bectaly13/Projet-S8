const mysqlConnect = require("../sqlConnect");
const dom = require("../sqlConfig").dom;

async function getDomains() {
    const query = `SELECT domainId, name
        FROM ${dom}
        WHERE subjectId = 1
        ORDER BY domainId`;
        
    const data = [];
    return mysqlConnect.query(query, data);
}

module.exports.getDomains = getDomains;