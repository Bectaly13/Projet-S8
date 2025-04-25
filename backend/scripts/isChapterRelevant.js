const {sendError, sendMessage} = require("../util/message");
const sql = require("../sql/sqlChapters");

async function isChapterRelevant(request, result) {
    const data = request.body;
    console.log("isChapterRelevant.js :", data);
    if("chapterId" in data) {   
        if("sectorId" in data) {
            if("mcqSize" in data) {
                return sendMessage(result, await sql.isChapterRelevant(data["chapterId"], data["sectorId"], data["mcqSize"]));
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

module.exports.isChapterRelevant = isChapterRelevant;