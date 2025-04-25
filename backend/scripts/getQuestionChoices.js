const {sendError, sendMessage} = require("../util/message");
const sql = require("../sql/sqlChoices");

async function getQuestionChoices(request, result) {
    const data = request.body;
    console.log("getQuestionChoices.js :", data);
    if("questionId" in data) {
        const res = await sql.getQuestionChoices(data["questionId"]);
        if(res.length) {
            return sendMessage(result, res);
        }
        else {
            return sendError(result, "Couldn't find question choices", 404);
        }         
    }
    else {
        return sendError(result, "Question ID is required");
    }
}

module.exports.getQuestionChoices = getQuestionChoices;