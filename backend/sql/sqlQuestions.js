const mysqlConnect = require("./sqlConnect");
const qst = require("./sqlConfig").qst;
const skl = require("./sqlConfig").skl;
const qgr = require("./sqlConfig").qgr;
const qsl = require("./sqlConfig").qsl;

async function getValidStudyIds(chapterId, sectorId) {
    let validStudyIds = [];

    let query = `SELECT DISTINCT ${qgr}.questionGroupId
        FROM ${qgr}
        JOIN ${qst} ON ${qgr}.questionGroupId = ${qst}.questionGroupId
        JOIN ${qsl} ON ${qst}.questionId = ${qsl}.questionId
        JOIN ${skl} ON ${qgr}.skillId = ${skl}.skillId    
        WHERE ${skl}.chapterId = ?
        AND ${qsl}.sectorId = ?`;
    
    let data = [chapterId, sectorId];
    let validQuestionGroupIds =  await mysqlConnect.query(query, data);

    for(let i = 0; i<validQuestionGroupIds.length; i++) {
        query = `SELECT questionId, questionGroupId, explanation, level, mixingType
            FROM ${qst}
            WHERE questionGroupId = ?
            ORDER BY level`;
        
        data = [validQuestionGroupIds[i]["questionGroupId"]];
        let result = await mysqlConnect.query(query, data);

        for(let j = 0; j<result.length; j++) {
            validStudyIds.push(result[j]);
        }
    }

    return validStudyIds;
}

module.exports.getValidStudyIds = getValidStudyIds;