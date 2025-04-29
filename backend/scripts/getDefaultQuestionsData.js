const {sendError, sendMessage} = require("../util/message");
const sql = require("../sql/sqlQuestions");

async function getDefaultQuestionsData(request, result) {
    const data = request.body;
    console.log("getDefaultQuestionsData.js :", data);
    if("mcqSize" in data) {
        return sendMessage(result, await sql.getDefaultQuestionsData(data["mcqSize"]));
    }
    else {
        return sendError(result, "MCQ size is required");
    }
}
    
module.exports.getDefaultQuestionsData = getDefaultQuestionsData;