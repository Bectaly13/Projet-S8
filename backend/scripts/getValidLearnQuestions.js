const {sendError, sendMessage} = require("../util/message");
const sql = require("../sql/sqlQuestions");

async function getValidLearnQuestions(request, result) {
    const data = request.body;
    console.log("getValidLearnQuestions.js :", data);
    if("skillId" in data) {
        if("sectorId" in data) {
            if("mcqSize" in data) {
                const res = await sql.getValidLearnQuestions(data["skillId"], data["sectorId"]);
                if(res.length >= data["mcqSize"]) {
                    return sendMessage(result, res);
                }
                else {
                    return sendError(result, "Couldn't find enough valid learn questions", 404);
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
        return sendError(result, "Skill ID is required");
    }
}

module.exports.getValidLearnQuestions = getValidLearnQuestions;