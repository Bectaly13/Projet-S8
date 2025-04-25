const {sendError, sendMessage} = require("./message");
const sql = require("./sql/sqlSkills");

async function areSkillsRelevant(request, result) {
    const data = request.body;
    console.log("areSkillsRelevant.js :", data);
    if("chapterId" in data) {   
        if("sectorId" in data) {
            if("mcqSize" in data) {
                return sendMessage(result, await sql.areSkillsRelevant(data["chapterId"], data["sectorId"], data["mcqSize"]));
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

module.exports.areSkillsRelevant = areSkillsRelevant;