const mysqlConnect = require("./sqlConnect");
const {skl, qgr, qst, qsl} = require("./sqlConfig");

async function getSkills(chapterId, sectorId) {
    // We get skills name and ID according to the user's sector ID.
    // A skill will be fetched if and only if it contains at least one valid question_group.
    // A question_group is valid if and only if it contains at least one validated question that is linked to the user's sector.
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