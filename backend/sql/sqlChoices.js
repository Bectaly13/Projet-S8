const mysqlConnect = require("./sqlConnect");
const cho = require("./sqlConfig").cho;

async function getQuestionChoices(questionId) {
    const query = `SELECT choiceOrder, wordingBefore, choiceText, wordingAfter, isCorrect
        FROM ${cho}
        WHERE questionId = ?`;
    
    data = [questionId];
    return await mysqlConnect.query(query, data);
}

module.exports.getQuestionChoices = getQuestionChoices;