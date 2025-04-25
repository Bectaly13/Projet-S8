const {sendError, sendMessage} = require("../util/message");
const sql = require("../sql/sqlQuestions");

async function getValidLearnQuestions(request, result) {
    const data = request.body;
    console.log("getValidLearnQuestions.js :", data);
    if("skillId" in data) {
        if("sectorId" in data) {
            if("mcqSize" in data) {
                const res = await sql.getValidLearnQuestions(data["skillId"], data["sectorId"], data["mcqSize"]);
                if(res.length) {
                    return sendMessage(result, res);
                }
                else {
                    return sendError(result, "Couldn't find any valid learn questions", 404);
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