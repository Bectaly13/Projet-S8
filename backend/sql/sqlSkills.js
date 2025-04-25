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

async function isSkillRelevant(skillId, sectorId) {
    const query = `SELECT qgr.questionGroupId
        FROM ${qgr} AS qgr
        JOIN ${qst} AS qst ON qgr.questionGroupId = qst.questionGroupId
        JOIN ${qsl} AS qsl ON qst.questionId = qsl.questionId
        WHERE qgr.skillId = ?
        AND qsl.sectorId = ?
        AND qst.validated = 1
        GROUP BY qgr.questionGroupId
        HAVING COUNT(qst.questionId) > 0
        LIMIT 1`;

    const data = [skillId, sectorId];
    const result = await mysqlConnect.query(query, data);

    return result.length > 0;
}  

module.exports.getSkills = getSkills;
module.exports.isSkillRelevant = isSkillRelevant;