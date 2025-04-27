const {sendError, sendMessage} = require("../util/message");
const sql = require("../sql/sqlChapters");

async function getChapters(request, result) {
    const data = request.body;
    console.log("getChapters.js :", data);
    if("domainId" in data) {
        if("sectorId" in data) {
            if("mcqSize" in data) {
                const res = await sql.getChapters(data["domainId"], data["sectorId"], data["mcqSize"]);
                if(res.length) {
                    return sendMessage(result, res);
                }
                else {
                    return sendError(result, "No chapters found");
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
        return sendError(result, "Domain ID is required");
    }
}

module.exports.getChapters = getChapters;