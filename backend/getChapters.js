const {sendError, sendMessage} = require("./message");
const sql = require("./sql/chapters/sqlChapters");

async function getChapters(request, result) {
    const data = request.body;
    console.log("getChapters.js :", data);
    if("domainId" in data) {
        const res = await sql.getChapters(data["domainId"]);
        if(res.length) {
            return sendMessage(result, res);
        }
        else {
            return sendError(result, "No chapters found", 404);
        }
    }
    else {
        return sendError(result, "Domain ID is required");
    }
}

module.exports.getChapters = getChapters;