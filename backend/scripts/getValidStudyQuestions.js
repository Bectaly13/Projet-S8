const {sendError, sendMessage} = require("../util/message");
const sql = require("../sql/sqlQuestions");

async function getValidStudyQuestions(request, result) {
    const data = request.body;
    console.log("getValidStudyQuestions.js :", data);
    if("chapterId" in data) {
        if("sectorId" in data) {
            if("mcqSize" in data) {
                const res = await sql.getValidStudyQuestions(data["chapterId"], data["sectorId"], data["mcqSize"]);
                if(res.length >= data["mcqSize"]) {
                    return sendMessage(result, res);
                }
                else {
                    return sendError(result, "Couldn't find enough valid study questions", 404);
                }
            }
            else {
                return sendError(result, "MCQ size is required");
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