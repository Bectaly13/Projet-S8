const {sendError, sendMessage} = require("../util/message");
const sql = require("../sql/sqlQuestions");

async function getSkillQuestions(request, result) {
    const data = request.body;
    console.log("getSkillQuestions.js :", data);
    if("chapterId" in data) {
        if("sectorId" in data) {
            return sendMessage(result, await sql.getSkillQuestions(data["chapterId"], data["sectorId"]));
        }
        else {
            return sendError(result, "Sector ID is required");
        }
    }
    else {
        return sendError(result, "Chapter ID is required");
    }
}
    
module.exports.getSkillQuestions = getSkillQuestions;