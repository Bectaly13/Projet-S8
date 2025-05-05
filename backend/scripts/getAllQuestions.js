const {sendMessage} = require("../util/message");

async function getAllQuestions(request, result) {
    const data = request.body;
    console.log("getAllQuestions.js :", data);
    return sendMessage(result, await get());
}

module.exports.getAllQuestions = getAllQuestions;

const {qst} = require("../sql/sqlConfig");
const mysqlConnect = require("../sql/sqlConnect");

async function get() {
    const query = `SELECT questionId, explanation, level, mixingType FROM ${qst} where validated=1`;
    return await mysqlConnect.query(query, []);
}