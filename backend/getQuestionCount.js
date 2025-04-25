const {sendMessage} = require("./message");
const sql = require("./sql/sqlQuestions");

async function getQuestionCount(request, result) {
    const data = request.body;
    console.log("getQuestionCount.js :", data);
    return sendMessage(result, await sql.getQuestionCount());
}

module.exports.getQuestionCount = getQuestionCount;