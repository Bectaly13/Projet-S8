const mysqlConnect = require("./sqlConnect");
const {dom, chp, skl, qgr, qst, qsl} = require("./sqlConfig")

async function getDomains(sectorId, mcqSize) {
    const query = `SELECT dom.domainId, dom.name
        FROM ${dom} AS dom
        WHERE dom.subjectId = 1
        AND EXISTS (
            SELECT 1
            FROM (
                SELECT chp.chapterId, qgr.questionGroupId
                FROM ${chp} AS chp
                JOIN ${skl} AS skl ON chp.chapterId = skl.chapterId
                JOIN ${qgr} AS qgr ON skl.skillId = qgr.skillId
                JOIN ${qst} AS qst ON qgr.questionGroupId = qst.questionGroupId
                JOIN ${qsl} AS qsl ON qst.questionId = qsl.questionId
                WHERE chp.domainId = dom.domainId
                AND qsl.sectorId = ?
                AND qst.validated = 1
                GROUP BY chp.chapterId, qgr.questionGroupId
                HAVING COUNT(qst.questionId) > 0
            ) AS valid_groups
            GROUP BY chapterId
            HAVING COUNT(questionGroupId) >= ?
        )
        ORDER BY dom.domainId`;

    const data = [sectorId, mcqSize];
    return mysqlConnect.query(query, data);
}
  
module.exports.getDomains = getDomains;