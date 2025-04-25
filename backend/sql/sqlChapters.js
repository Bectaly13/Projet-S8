const mysqlConnect = require("./sqlConnect");
const {chp, skl, qgr, qst, qsl} = require("./sqlConfig");

async function getChapters(domainId) {
    const query = `SELECT chapterId, name
        FROM ${chp}
        WHERE domainId = ?
        ORDER BY chapterId`;
        
    const data = [domainId];
    return mysqlConnect.query(query, data);
}

async function isChapterRelevant(chapterId, sectorId, mcqSize) {
    const query = `SELECT COUNT(*) AS groupCount FROM (
        SELECT qgr.questionGroupId
        FROM ${qgr} AS qgr
        JOIN ${skl} AS skl ON qgr.skillId = skl.skillId
        JOIN ${qst} AS qst ON qgr.questionGroupId = qst.questionGroupId
        JOIN ${qsl} AS qsl ON qst.questionId = qsl.questionId
        WHERE skl.chapterId = ?
        AND qsl.sectorId = ?
        AND qst.validated = 1
        GROUP BY qgr.questionGroupId
        HAVING COUNT(qst.questionId) > 0
        ) AS relevant_groups`;
  
    const data = [chapterId, sectorId];
    const result = await mysqlConnect.query(query, data);
  
    return (result[0]?.groupCount ?? 0) >= mcqSize;
}

module.exports.getChapters = getChapters;
module.exports.isChapterRelevant = isChapterRelevant;