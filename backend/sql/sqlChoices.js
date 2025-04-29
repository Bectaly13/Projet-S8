const mysqlConnect = require("./sqlConnect");
const cho = require("./sqlConfig").cho;

async function getChoices(questionIds) {
    // questionIds is an array of number, representing the questions used in the created MCQ.
    const placeholders = questionIds.map(() => '?').join(', ');
    const query = `
        SELECT questionId, choiceOrder, wordingBefore, choiceText, wordingAfter, isCorrect
        FROM ${cho}
        WHERE questionId IN (${placeholders})
        ORDER BY choiceOrder
    `;

    const result = await mysqlConnect.query(query, questionIds);

    // We transform result into a {questionId: [choices]} object.
    // [choices] is an array containing all the choices linked to questionId.
    // Each choice contains its questionOrder, wordingBefore, choiceText, wordingAfter and isCorrect fields.
    const choicesByQuestion = {};

    for (const row of result) {
        if (!choicesByQuestion[row.questionId]) {
            choicesByQuestion[row.questionId] = [];
        }
        choicesByQuestion[row.questionId].push({
            choiceOrder: row.choiceOrder,
            wordingBefore: row.wordingBefore,
            choiceText: row.choiceText,
            wordingAfter: row.wordingAfter,
            isCorrect: row.isCorrect
        });
    }

    return choicesByQuestion;
}

module.exports.getChoices = getChoices;