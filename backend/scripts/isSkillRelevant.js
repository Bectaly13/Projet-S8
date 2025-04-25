const {sendError, sendMessage} = require("../util/message");
const sql = require("../sql/sqlSkills");

async function isSkillRelevant(request, result) {
    const data = request.body;
    console.log("isSkillRelevant.js :", data);
    if("skillId" in data) {   
        if("sectorId" in data) {
            return sendMessage(result, await sql.isSkillRelevant(data["skillId"], data["sectorId"]));         
        } 
        else {
            return sendError(result, "Sector ID is required");
        }
    }
    else {
        return sendError(result, "Skill ID is required");
    }
}

module.exports.isSkillRelevant = isSkillRelevant;