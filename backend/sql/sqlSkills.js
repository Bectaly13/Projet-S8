const mysqlConnect = require("./sqlConnect");
const skl = require("./sqlConfig").skl;

async function getSkills(domainId) {
    const query = `SELECT skillId, name
        FROM ${skl}
        WHERE chapterId = ?
        ORDER BY skillId`;
        
    const data = [domainId];
    return mysqlConnect.query(query, data);
}

module.exports.getSkills = getSkills;