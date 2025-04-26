const mysqlConnect = require("./sqlConnect");
const {skl, qgr, qst, qsl} = require("./sqlConfig");

async function getSkills(chapterId, sectorId) {
    const query = `SELECT DISTINCT skl.skillId, skl.name
        FROM ${skl} AS skl
        JOIN ${qgr} AS qgr ON skl.skillId = qgr.skillId
        JOIN ${qst} AS qst ON qgr.questionGroupId = qst.questionGroupId
        JOIN ${qsl} AS qsl ON qst.questionId = qsl.questionId
        WHERE skl.chapterId = ?
        AND qsl.sectorId = ?
        AND qst.validated = 1
        GROUP BY skl.skillId
        HAVING COUNT(qgr.questionGroupId) > 0
        ORDER BY skl.skillId`;

    const data = [chapterId, sectorId];
    return mysqlConnect.query(query, data);
}

module.exports.getSkills = getSkills;