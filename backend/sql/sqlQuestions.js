const mysqlConnect = require("./sqlConnect");
const {qst, skl, qgr, qsl, dom, chp} = require("./sqlConfig");

async function getValidStudyQuestions(chapterId, sectorId) {
    // This method is used to gather all valid questions for study mode according to the chapter ID and the user's sector ID.
    // A question is valid if and only if it is linked to the user's sector and to the correct chapter, while being validated.
    // Questions are grouped by question_group.

    // Step 1 : we select all valid questions from valid question_groups linked to the right chapter and sector.
    let query = `SELECT qgr.questionGroupId, qst.questionId, qst.explanation, qst.level, qst.mixingType
        FROM ${qgr} AS qgr
        JOIN ${qst} AS qst ON qgr.questionGroupId = qst.questionGroupId
        JOIN ${qsl} AS qsl ON qst.questionId = qsl.questionId
        JOIN ${skl} AS skl ON qgr.skillId = skl.skillId
        WHERE skl.chapterId = ?
        AND qsl.sectorId = ?
        AND qst.validated = 1`;

    let data = [chapterId, sectorId];
    let results = await mysqlConnect.query(query, data);

    // Step 2 : we group the questions by questionGroupId
    let groupedQuestions = {};

    for (let row of results) {
        let groupId = row.questionGroupId;

        if (!groupedQuestions[groupId]) {
            groupedQuestions[groupId] = [];
        }

        groupedQuestions[groupId].push({
            questionId: row.questionId,
            explanation: row.explanation,
            level: row.level,
            mixingType: row.mixingType
        });
    }

    // Step 3 : we return the grouped questions
    return groupedQuestions;
}


async function getValidLearnQuestions(skillId, sectorId) {
    // This method is used to gather all valid questions for learn mode according to the skill ID and the user's sector ID.
    // A question is valid if and only if it is linked to the user's sector and to the correct skill, while being validated.
    // Questions are grouped by question_group.

    // Step 1 : we select all valid questions from valid question_groups linked to the right skill and sector.
    let query = `SELECT qgr.questionGroupId, qst.questionId, qst.explanation, qst.level, qst.mixingType
        FROM ${qgr} AS qgr
        JOIN ${qst} AS qst ON qgr.questionGroupId = qst.questionGroupId
        JOIN ${qsl} AS qsl ON qst.questionId = qsl.questionId
        WHERE qgr.skillId = ?
        AND qsl.sectorId = ?
        AND qst.validated = 1`;

    let data = [skillId, sectorId];
    let results = await mysqlConnect.query(query, data);

    // Step 2 : we group the questions by questionGroupId
    let groupedQuestions = {};

    for (let row of results) {
        let groupId = row.questionGroupId;

        if (!groupedQuestions[groupId]) {
            groupedQuestions[groupId] = [];
        }

        groupedQuestions[groupId].push({
            questionId: row.questionId,
            explanation: row.explanation,
            level: row.level,
            mixingType: row.mixingType
        });
    }

    // Step 3 : we return the grouped questions
    return groupedQuestions;
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

async function getDefaultQuestionsData(sectorId, mcqSize) {
    // This method is used to create the default data structure containing the user's statistics about questions.
    const defaultQuestionsData = {};
  
    defaultQuestionsData[sectorId] = {};
        
    // Step 1 : get all valid chapters for this sector.
    // A chapter is valid if and only if it contains at least "mcqSize" valid question_groups.
    // A question_group is valid if and only if it contains at leat 1 valid question.
    // A question is valid if and only if it is validated and linked to the correct sector.
    const chaptersQuery = `SELECT chp.chapterId, dom.domainId, COUNT(DISTINCT qgr.questionGroupId) AS groupCount
        FROM ${chp} AS chp
        JOIN ${dom} AS dom ON chp.domainId = dom.domainId
        JOIN ${skl} AS skl ON skl.chapterId = chp.chapterId
        JOIN ${qgr} AS qgr ON qgr.skillId = skl.skillId
        JOIN ${qst} AS qst ON qst.questionGroupId = qgr.questionGroupId
        JOIN ${qsl} AS qsl ON qsl.questionId = qst.questionId
        WHERE qst.validated = 1
            AND dom.subjectId = 1
            AND qsl.sectorId = ?
        GROUP BY chp.chapterId, dom.domainId
        HAVING groupCount >= ?`;
        
    const chaptersData = [sectorId, mcqSize];
    const validChapters = await mysqlConnect.query(chaptersQuery, chaptersData);
  
    // Step 2 : build the structure domainId -> chapterId.
    for (const chapter of validChapters) {
        const domainId = chapter.domainId;
        const chapterId = chapter.chapterId;
            
        if (!defaultQuestionsData[sectorId][domainId]) {
            defaultQuestionsData[sectorId][domainId] = {};
        }
        defaultQuestionsData[sectorId][domainId][chapterId] = {
            correct: [],
            incorrect: [],
            unseen: []
        };
        
        // Step 3 : get all valid questions for this chapter and this sector.
        const questionsQuery = `SELECT DISTINCT qst.questionId
            FROM ${chp} AS chp
            JOIN ${skl} AS skl ON skl.chapterId = chp.chapterId
            JOIN ${qgr} AS qgr ON qgr.skillId = skl.skillId
            JOIN ${qst} AS qst ON qst.questionGroupId = qgr.questionGroupId
            JOIN ${qsl} AS qsl ON qsl.questionId = qst.questionId
            WHERE chp.chapterId = ?
                AND qst.validated = 1
                AND qsl.sectorId = ?`;

        const questionsData = [chapterId, sectorId];
        const questions = await mysqlConnect.query(questionsQuery, questionsData);
        
        // Step 4 : update the "unseen" field.
        defaultQuestionsData[sectorId][domainId][chapterId].unseen = questions.map(q => q.questionId);
    }
  
    return defaultQuestionsData;
}

async function getSkillQuestions(chapterId, sectorId) {
    // Step 1 : get valid skills for this chapter
    const validSkillsQuery = `SELECT DISTINCT skl.skillId
      FROM ${skl} AS skl
      JOIN ${qgr} AS qgr ON qgr.skillId = skl.skillId
      JOIN ${qst} AS qst ON qst.questionGroupId = qgr.questionGroupId
      JOIN ${qsl} AS qsl ON qsl.questionId = qst.questionId
      WHERE skl.chapterId = ?
        AND qst.validated = 1
        AND qsl.sectorId = ?`;

    const validSkillsData = [chapterId, sectorId];
    const validSkills = await mysqlConnect.query(validSkillsQuery, validSkillsData);
  
    const result = {};
  
    // Step 2 : get questions for each valid skill
    for (const skill of validSkills) {
        const skillId = skill.skillId;
  
        const questionsQuery = `SELECT qst.questionId
            FROM ${qst} AS qst
            JOIN ${qgr} AS qgr ON qst.questionGroupId = qgr.questionGroupId
            JOIN ${qsl} AS qsl ON qst.questionId = qsl.questionId
            WHERE qst.validated = 1
                AND qgr.skillId = ?
                AND qsl.sectorId = ?`;

        const questionsData = [skillId, sectorId];
        const questions = await mysqlConnect.query(questionsQuery, questionsData);
  
      // Get questionIds in an array
      result[skillId] = questions.map(q => q.questionId);
    }
  
    return result;
  }
  
  
module.exports.getValidStudyQuestions = getValidStudyQuestions;
module.exports.getValidLearnQuestions = getValidLearnQuestions;
module.exports.getQuestionCount = getQuestionCount;
module.exports.getDefaultQuestionsData = getDefaultQuestionsData;
module.exports.getSkillQuestions = getSkillQuestions;