const mysqlConnect = require("./sqlConnect");
const {qst, skl, qgr, qsl, dom, chp, sct} = require("./sqlConfig");

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

async function getDefaultQuestionsData(sectorId, mcqSize) {
    // This method is used to create the default data structure containing the user's statistics about questions.
    const defaultQuestionsData = {};
  
    defaultQuestionsData[sectorId] = {};
        
    // Step 1 : get all valid chapters for this sector.
    // A chapter is valid if and only if it contains at least "mcqSize" valid question_groups.
    // A question_group is valid if and only if it contains at leat 1 valid question.
    // A question is valid if and only if it is validated and linked to the correct sector.
    const chaptersQuery = `SELECT chp.chapterId, dom.domainId, COUNT(DISTINCT qgr.questionGroupId) AS groupCount
        FROM chapters AS chp
        JOIN domains AS dom ON chp.domainId = dom.domainId
        JOIN skills AS skl ON skl.chapterId = chp.chapterId
        JOIN question_groups AS qgr ON qgr.skillId = skl.skillId
        JOIN questions AS qst ON qst.questionGroupId = qgr.questionGroupId
        JOIN questions_sectors_link AS qsl ON qsl.questionId = qst.questionId
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
    // Étape 1 : récupérer les skills valides du chapitre
    const validSkillsQuery = `
      SELECT DISTINCT skl.skillId
      FROM ${skl} AS skl
      JOIN ${qgr} AS qgr ON qgr.skillId = skl.skillId
      JOIN ${qst} AS qst ON qst.questionGroupId = qgr.questionGroupId
      JOIN ${qsl} AS qsl ON qsl.questionId = qst.questionId
      WHERE skl.chapterId = ?
        AND qst.validated = 1
        AND qsl.sectorId = ?
    `;
    const skills = await mysqlConnect.query(validSkillsQuery, [chapterId, sectorId]);
  
    const result = {};
  
    // Étape 2 : pour chaque skill valide, récupérer les questions correspondantes
    for (const skill of skills) {
      const skillId = skill.skillId;
  
      const questionsQuery = `
        SELECT qst.questionId
        FROM ${qst} AS qst
        JOIN ${qgr} AS qgr ON qst.questionGroupId = qgr.questionGroupId
        JOIN ${qsl} AS qsl ON qst.questionId = qsl.questionId
        WHERE qst.validated = 1
          AND qgr.skillId = ?
          AND qsl.sectorId = ?
      `;
      const questions = await mysqlConnect.query(questionsQuery, [skillId, sectorId]);
  
      // Stocker juste les questionId sous forme de tableau d'entiers
      result[skillId] = questions.map(q => q.questionId);
    }
  
    return result;
  }
  
  
module.exports.getValidStudyQuestions = getValidStudyQuestions;
module.exports.getValidLearnQuestions = getValidLearnQuestions;
module.exports.getQuestionCount = getQuestionCount;
module.exports.getDefaultQuestionsData = getDefaultQuestionsData;
module.exports.getSkillQuestions = getSkillQuestions;