const mysqlConnect = require("./sqlConnect");
const {dom, chp, skl, qgr, qst, qsl} = require("./sqlConfig")

async function getDomains() {
    const query = `SELECT domainId, name
        FROM ${dom}
        WHERE subjectId = 1
        ORDER BY domainId`;
        
    const data = [];
    return mysqlConnect.query(query, data);
}

async function isDomainRelevant(domainId, sectorId, mcqSize) {
    const query = `SELECT COUNT(qst.questionId) AS questionCount
        FROM ${qst} AS qst
        JOIN ${qsl} AS qsl ON qst.questionId = qsl.questionId
        JOIN ${qgr} AS qgr ON qst.questionGroupId = qgr.questionGroupId
        JOIN ${skl} AS skl ON qgr.skillId = skl.skillId
        JOIN ${chp} AS chp ON skl.chapterId = chp.chapterId
        WHERE chp.domainId = ?
        AND qsl.sectorId = ?
        GROUP BY chp.chapterId
        HAVING COUNT(qst.questionId) >= ?
        LIMIT 1`;
  
    const data = [domainId, sectorId, mcqSize];
    const result = await mysqlConnect.query(query, data);
  
    return result.length > 0;
}
  

module.exports.getDomains = getDomains;
module.exports.isDomainRelevant = isDomainRelevant;