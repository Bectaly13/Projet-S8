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

async function isSkillRelevant(skillId, sectorId, mcqSize) {
    const query = `SELECT COUNT(qst.questionId) AS questionCount
        FROM ${qst} AS qst
        JOIN ${qgr} AS qgr ON qst.questionGroupId = qgr.questionGroupId
        JOIN ${qsl} AS qsl ON qst.questionId = qsl.questionId
        WHERE qgr.skillId = ?
        AND qsl.sectorId = ?`;
  
    const data = [skillId, sectorId];
    const result = await mysqlConnect.query(query, data);

    return result[0]["questionCount"] >= mcqSize;
}  

module.exports.getSkills = getSkills;
module.exports.isSkillRelevant = isSkillRelevant;