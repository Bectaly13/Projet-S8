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
    const query = `SELECT chapterId
        FROM (
        SELECT chp.chapterId, qgr.questionGroupId, COUNT(qst.questionId) AS questionCount
        FROM ${chp} AS chp
        JOIN ${skl} AS skl ON chp.chapterId = skl.chapterId
        JOIN ${qgr} AS qgr ON skl.skillId = qgr.skillId
        JOIN ${qst} AS qst ON qgr.questionGroupId = qst.questionGroupId
        JOIN ${qsl} AS qsl ON qst.questionId = qsl.questionId
        WHERE chp.domainId = ?
        AND qsl.sectorId = ?
        AND qst.validated = 1
        GROUP BY chp.chapterId, qgr.questionGroupId
        HAVING COUNT(qst.questionId) > 0
        ) AS valid_groups
        GROUP BY chapterId
        HAVING COUNT(questionGroupId) >= ?
        LIMIT 1`;

  const data = [domainId, sectorId, mcqSize];
  const result = await mysqlConnect.query(query, data);

  return result.length > 0;
}
  
module.exports.getDomains = getDomains;
module.exports.isDomainRelevant = isDomainRelevant;