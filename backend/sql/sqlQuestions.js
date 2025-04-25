const mysqlConnect = require("./sqlConnect");
const {qst, skl, qgr, qsl} = require("./sqlConfig");

async function getValidStudyQuestions(chapterId, sectorId, mcqSize) {
    let validStudyQuestions = [];

    // Étape 1 : Sélectionner les question_groups valides
    let query = `SELECT DISTINCT qgr.questionGroupId
        FROM ${qgr} AS qgr
        JOIN ${qst} AS qst ON qgr.questionGroupId = qst.questionGroupId
        JOIN ${qsl} AS qsl ON qst.questionId = qsl.questionId
        JOIN ${skl} AS skl ON qgr.skillId = skl.skillId    
        WHERE skl.chapterId = ?
        AND qsl.sectorId = ?
        AND qst.validated = 1`;
    
    let data = [chapterId, sectorId];
    let validQuestionGroupIds = await mysqlConnect.query(query, data);

    // Étape 2 : Sélectionner un nombre égal à mcqSize de question_groups
    let selectedQuestionGroups = [];
    while (selectedQuestionGroups.length < mcqSize && validQuestionGroupIds.length > 0) {
        let randomIndex = Math.floor(Math.random() * validQuestionGroupIds.length);
        let selectedGroup = validQuestionGroupIds[randomIndex];
        selectedQuestionGroups.push(selectedGroup.questionGroupId);
        validQuestionGroupIds.splice(randomIndex, 1);
    }

    // Étape 3 : Pour chaque question_group, sélectionner une question valide
    for (let groupId of selectedQuestionGroups) {
        query = `SELECT questionId, explanation, level, mixingType
            FROM ${qst}
            WHERE questionGroupId = ?
            AND validated = 1`;

        data = [groupId];
        let result = await mysqlConnect.query(query, data);

        // Sélectionner une question aléatoire par groupe
        if (result.length > 0) {
            let randomIndex = Math.floor(Math.random() * result.length);
            validStudyQuestions.push(result[randomIndex]);
        }
    }

    return validStudyQuestions;
}

async function getValidLearnQuestions(skillId, sectorId, mcqSize) {
    let validLearnQuestions = [];

    // Étape 1 : Sélectionner les question_groups valides
    let query = `SELECT DISTINCT qgr.questionGroupId
        FROM ${qgr} AS qgr
        JOIN ${qst} AS qst ON qgr.questionGroupId = qst.questionGroupId
        JOIN ${qsl} AS qsl ON qst.questionId = qsl.questionId
        WHERE qgr.skillId = ?
        AND qsl.sectorId = ?
        AND qst.validated = 1`;
    
    let data = [skillId, sectorId];
    let validQuestionGroupIds = await mysqlConnect.query(query, data);

    // Étape 2 : Sélectionner un nombre égal à mcqSize de question_groups
    let selectedQuestionGroups = [];
    while (selectedQuestionGroups.length < mcqSize && validQuestionGroupIds.length > 0) {
        let randomIndex = Math.floor(Math.random() * validQuestionGroupIds.length);
        let selectedGroup = validQuestionGroupIds[randomIndex];
        selectedQuestionGroups.push(selectedGroup.questionGroupId);
        validQuestionGroupIds.splice(randomIndex, 1);
    }

    // Étape 3 : Pour chaque question_group, sélectionner une question valide
    for (let groupId of selectedQuestionGroups) {
        query = `SELECT questionId, explanation, level, mixingType
            FROM ${qst}
            WHERE questionGroupId = ?
            AND validated = 1`;

        data = [groupId];
        let result = await mysqlConnect.query(query, data);

        // Sélectionner une question aléatoire par groupe
        if (result.length > 0) {
            let randomIndex = Math.floor(Math.random() * result.length);
            validLearnQuestions.push(result[randomIndex]);
        }
    }

    return validLearnQuestions;
}

async function getQuestionCount() {
    const query = `SELECT COUNT(questionId)
        FROM ${qst}
        WHERE validated = 1`;
    
    const data = [];
    return await mysqlConnect.query(query, data);  
}

module.exports.getValidStudyQuestions = getValidStudyQuestions;
module.exports.getValidLearnQuestions = getValidLearnQuestions;
module.exports.getQuestionCount = getQuestionCount;