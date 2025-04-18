const {sendError, sendMessage} = require("./message");
const sql = require("./sql/sqlQuestions");

async function getValidStudyQuestions(request, result) {
    const data = request.body;
    console.log("getValidStudyQuestions.js :", data);
    if("chapterId" in data) {
        if("sectorId" in data) {
            const res = await sql.getValidStudyQuestions(data["chapterId"], data["sectorId"]);
            if(res.length) {
                return sendMessage(result, res);
            }
            else {
                return sendError(result, "Couldn't find any valid ID", 404);
            }
        }
        else {
            return sendError(result, "Sector ID is required");
        }
    }
    else {
        return sendError(result, "Chapter ID is required");
    }
}

module.exports.getValidStudyQuestions = getValidStudyQuestions;