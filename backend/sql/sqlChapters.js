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
    const query = `SELECT COUNT(qst.questionId) AS questionCount
        FROM ${qst} AS qst
        JOIN ${qsl} AS qsl ON qst.questionId = qsl.questionId
        JOIN ${qgr} AS qgr ON qst.questionGroupId = qgr.questionGroupId
        JOIN ${skl} AS skl ON qgr.skillId = skl.skillId
        WHERE skl.chapterId = ?
        AND qsl.sectorId = ?
        AND qst.validated = 1`;
  
    const data = [chapterId, sectorId];
    const result = await mysqlConnect.query(query, data);
  
    return (result[0]?.questionCount ?? 0) >= mcqSize;
}

module.exports.getChapters = getChapters;
module.exports.isChapterRelevant = isChapterRelevant;