const mysqlConnect = require("./sqlConnect");
const {qst, skl, qgr, qsl} = require("./sqlConfig");

async function getValidStudyQuestions(chapterId, sectorId, mcqSize) {
    // This method is used to gather "mcqSize" valid questions for study mode according to the chapter ID and the user's sector ID.
    // A question is valid if and only if it is linked to the user's sector and to the correct chapter.
    let validStudyQuestions = [];

    // Step 1 : we get all the valid question_groups in this chapter.
    // A question_group is valid if and only if it contains at least one validated question linked to the correct sector.
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

    // Step 2 : we get "mcqSize" of these question_groups.
    let selectedQuestionGroups = [];
    while (selectedQuestionGroups.length < mcqSize && validQuestionGroupIds.length > 0) {
        let randomIndex = Math.floor(Math.random() * validQuestionGroupIds.length);
        let selectedGroup = validQuestionGroupIds[randomIndex];
        selectedQuestionGroups.push(selectedGroup.questionGroupId);
        validQuestionGroupIds.splice(randomIndex, 1);
    }

    // Step 3 : for each question_group, we get a valid question.
    // A question is valid if and only if it is validated and linked to the correct sector.
    for (let groupId of selectedQuestionGroups) {
        query = `SELECT questionId, explanation, level, mixingType
            FROM ${qst}
            WHERE questionGroupId = ?
            AND validated = 1`;

        data = [groupId];
        let result = await mysqlConnect.query(query, data);

        if (result.length > 0) {
            let randomIndex = Math.floor(Math.random() * result.length);
            validStudyQuestions.push(result[randomIndex]);
        }
    }

    // Step 4 : we sort the questions by level.
    validStudyQuestions.sort((a, b) => a.level - b.level);

    return validStudyQuestions;
}

async function getValidLearnQuestions(skillId, sectorId, mcqSize) {    
    // This method is used to gather between 1 and "mcqSize" valid questions for learn mode according to the skill ID and the user's sector ID.
    // A question is valid if and only if it is linked to the user's sector and to the correct skill.
    let validLearnQuestions = [];

    // Step 1 : we get all the valid question_groups in this skill.
    // A question_group is valid if and only if it contains at least one validated question linked to the correct sector.
    let query = `SELECT DISTINCT qgr.questionGroupId
        FROM ${qgr} AS qgr
        JOIN ${qst} AS qst ON qgr.questionGroupId = qst.questionGroupId
        JOIN ${qsl} AS qsl ON qst.questionId = qsl.questionId
        WHERE qgr.skillId = ?
        AND qsl.sectorId = ?
        AND qst.validated = 1`;
    
    let data = [skillId, sectorId];
    let validQuestionGroupIds = await mysqlConnect.query(query, data);

    // Step 2 : we get "mcqSize" of these question_groups if possible.
    // If not, we get the maximum.
    let selectedQuestionGroups = [];
    while (selectedQuestionGroups.length < mcqSize && validQuestionGroupIds.length > 0) {
        let randomIndex = Math.floor(Math.random() * validQuestionGroupIds.length);
        let selectedGroup = validQuestionGroupIds[randomIndex];
        selectedQuestionGroups.push(selectedGroup.questionGroupId);
        validQuestionGroupIds.splice(randomIndex, 1);
    }

    // Step 3 : for each question_group, we get a valid question.
    // A question is valid if and only if it is validated and linked to the correct sector.
    for (let groupId of selectedQuestionGroups) {
        query = `SELECT questionId, explanation, level, mixingType
            FROM ${qst}
            WHERE questionGroupId = ?
            AND validated = 1`;

        data = [groupId];
        let result = await mysqlConnect.query(query, data);

        if (result.length > 0) {
            let randomIndex = Math.floor(Math.random() * result.length);
            validLearnQuestions.push(result[randomIndex]);
        }
    }

    // Step 4 : we sort the questions by level.
    validLearnQuestions.sort((a, b) => a.level - b.level);

    return validLearnQuestions;
}

async function getQuestionCount() {
    // This method is used to display accurate data in the FAQ.
    // It shows how many validated questions exist in the database.
    const query = `SELECT COUNT(questionId)
        FROM ${qst}
        WHERE validated = 1`;
    
    const data = [];
    return await mysqlConnect.query(query, data);  
}

module.exports.getValidStudyQuestions = getValidStudyQuestions;
module.exports.getValidLearnQuestions = getValidLearnQuestions;
module.exports.getQuestionCount = getQuestionCount;