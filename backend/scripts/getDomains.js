const {sendError, sendMessage} = require("../util/message");
const sql = require("../sql/sqlDomains");

async function getDomains(request, result) {
    const data = request.body;
    console.log("getDomains.js :", data);
    if("sectorId" in data) {
        if("mcqSize" in data) {
            const res = await sql.getDomains(data["sectorId"], data["mcqSize"]);
            if(res.length) {
                return sendMessage(result, res);
            }
            else {
                return sendError(result, "No domains found");
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

module.exports.getDomains = getDomains;