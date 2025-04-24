const mysqlConnect = require("./sqlConnect");
const {skl, qgr, qst, qsl} = require("./sqlConfig");

async function getSkills(domainId) {
    const query = `SELECT skillId, name
        FROM ${skl}
        WHERE chapterId = ?
        ORDER BY skillId`;
        
    const data = [domainId];
    return mysqlConnect.query(query, data);
}

async function areSkillsRelevant(chapterId, sectorId, mcqSize) {
    const query = `SELECT skl.skillId, COUNT(qst.questionId) AS questionCount
        FROM ${skl} AS skl
        JOIN ${qgr} AS qgr ON skl.skillId = qgr.skillId
        JOIN ${qst} AS qst ON qgr.questionGroupId = qst.questionGroupId
        JOIN ${qsl} AS qsl ON qst.questionId = qsl.questionId
        WHERE skl.chapterId = ?
        AND qsl.sectorId = ?
        GROUP BY skl.skillId
        HAVING questionCount >= ?
        LIMIT 1`;
  
    const data = [chapterId, sectorId, mcqSize];
    const result = await mysqlConnect.query(query, data);
  
    return result.length > 0;
}  

module.exports.getSkills = getSkills;
module.exports.areSkillsRelevant = areSkillsRelevant;