const mysqlConnect = require("./sqlConnect");
const qst = require("./sqlConfig").qst;
const skl = require("./sqlConfig").skl;
const qgr = require("./sqlConfig").qgr;
const qsl = require("./sqlConfig").qsl;

async function getStudyQuestions2(chapterId, sectorId, mcqSize) {
    let questions = [];
    let usedQuestionGroupIds = []; // "mcqSize" questionGroupIds distincts sélectionnées depuis validQuestionGroupdIds
    let validQuestionGroupIds = []; // questionGroupIds se référant au bon chapitre et à la bonne filière

    let query = `SELECT DISTINCT ${qgr}.questionGroupId
        FROM ${qgr}
        JOIN ${skl} ON ${qgr}.skillId = ${skl}.skillId
        JOIN ${qst} ON ${qgr}.questionGroupId = ${qst}.questionGroupId
        JOIN ${qsl} ON ${qst}.questionId = ${qsl}.questionId
        WHERE ${skl}.chapterId = ?
        AND ${qsl}.sectorId = ?`;
    
    let data = [chapterId, sectorId];
    let result = await mysqlConnect.query(query, data);

    validQuestionGroupIds = result;

    console.log(validQuestionGroupIds.length, "ids trouvés sur ", mcqSize);

    if(validQuestionGroupIds.length < mcqSize) {
        return [];
    }
    
    for(let i = 0; i<mcqSize; i++) {
        let randomIndex = -1;

        while(randomIndex == -1 || usedQuestionGroupIds.some((item) => item.questionGroupId === validQuestionGroupIds[randomIndex].questionGroupId)) {
            randomIndex = Math.floor(Math.random() * validQuestionGroupIds.length);
        }

        usedQuestionGroupIds.push(validQuestionGroupIds[randomIndex]);
    }

    for(let j = 0; j<usedQuestionGroupIds.length; j++) {
        query = `SELECT ${qst}.questionId, ${qst}.questionGroupId, explanation, level, mixingType
            FROM ${qst}
            JOIN ${qsl} ON ${qst}.questionId = ${qsl}.questionId
            WHERE ${qsl}.sectorId = ?
            AND ${qst}.questionGroupId = ?`;
        
        data = [sectorId, usedQuestionGroupIds[j]["questionGroupId"]];
        result = await mysqlConnect.query(query, data);

        questions.push(result);
    }

    console.log(questions);
    return questions;
}

async function getStudyQuestions(chapterId, sectorId, mcqSize) {
    const query = `SELECT ${qst}.questionId, ${qst}.questionGroupId, explanation, level, mixingType
        FROM ${qst}
        JOIN ${qsl} ON ${qst}.questionId = ${qsl}.questionId
        JOIN ${qgr} ON ${qst}.questionGroupId = ${qgr}.questionGroupId
        JOIN ${skl} ON ${qgr}.skillId = ${skl}.skillId
        WHERE ${skl}.chapterId = ?
        AND ${qsl}.sectorId = ?
        AND ${qst}.validated = 1`;
    
    data = [chapterId, sectorId];
    result = await mysqlConnect.query(query, data);

    console.log(result);
    console.log(result.length);

    if(result.length < mcqSize) {
        return [];
    }

    return result;
}

module.exports.getStudyQuestions = getStudyQuestions;