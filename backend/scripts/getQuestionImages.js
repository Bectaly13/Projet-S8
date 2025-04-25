const {sendError, sendMessage} = require("../util/message");
const sql = require("../sql/sqlImages");

async function getQuestionImages(request, result) {
    const data = request.body;
    console.log("getQuestionImages.js :", data);
    if("questionId" in data) {
        const res = await sql.getQuestionImages(data["questionId"]);
        return sendMessage(result, res);      
    }
    else {
        return sendError(result, "Question ID is required");
    }
}

module.exports.getQuestionImages = getQuestionImages;