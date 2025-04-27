const {sendError, sendMessage} = require("../util/message");
const sql = require("../sql/sqlSkills");

async function getSkills(request, result) {
    const data = request.body;
    console.log("getSkills.js :", data);
    if("chapterId" in data) {
        if("sectorId" in data) {
            const res = await sql.getSkills(data["chapterId"], data["sectorId"]);
            if(res.length) {
                return sendMessage(result, res);
            }
            else {
                return sendError(result, "No skills found");
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

module.exports.getSkills = getSkills;