const mysqlConnect = require("./sqlConnect");
const {chp, skl, qgr, qst, qsl} = require("./sqlConfig");

async function getChapters(domainId, sectorId, mcqSize) {
    const query = `
        SELECT chp.chapterId, chp.name
        FROM ${chp} AS chp
        JOIN (
            SELECT skl.chapterId
            FROM ${qgr} AS qgr
            JOIN ${skl} AS skl ON qgr.skillId = skl.skillId
            JOIN ${qst} AS qst ON qgr.questionGroupId = qst.questionGroupId
            JOIN ${qsl} AS qsl ON qst.questionId = qsl.questionId
            WHERE qsl.sectorId = ?
            AND qst.validated = 1
            GROUP BY qgr.questionGroupId, skl.chapterId
            HAVING COUNT(qst.questionId) > 0
        ) AS valid_groups ON valid_groups.chapterId = chp.chapterId
        WHERE chp.domainId = ?
        GROUP BY chp.chapterId
        HAVING COUNT(valid_groups.chapterId) >= ?
        ORDER BY chp.chapterId
    `;

    const data = [sectorId, domainId, mcqSize];
    return mysqlConnect.query(query, data);
}

module.exports.getChapters = getChapters;