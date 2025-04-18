const mysqlConnect = require("./sqlConnect");
const qst = require("./sqlConfig").qst;
const skl = require("./sqlConfig").skl;
const qgr = require("./sqlConfig").qgr;
const qsl = require("./sqlConfig").qsl;

async function getValidStudyIds(chapterId, sectorId) {
    const query = `SELECT DISTINCT ${qst}.questionId
        FROM ${qst}
        JOIN ${qsl} ON ${qst}.questionId = ${qsl}.questionId
        JOIN ${qgr} ON ${qst}.questionGroupId = ${qst}.questionGroupId
        JOIN ${skl} ON ${qgr}.skillId = ${skl}.skillId    
        WHERE ${skl}.chapterId = ?
        AND ${qsl}.sectorId = ?`;
    
    const data = [chapterId, sectorId];
    return await mysqlConnect.query(query, data);
}

module.exports.getValidStudyIds = getValidStudyIds;