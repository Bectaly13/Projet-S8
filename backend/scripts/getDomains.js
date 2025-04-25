const {sendError, sendMessage} = require("../util/message");
const sql = require("../sql/sqlDomains");

async function getDomains(request, result) {
    const data = request.body;
    console.log("getDomains.js :", data);
    const res = await sql.getDomains();
    if(res.length) {
        return sendMessage(result, res);
    }
    else {
        return sendError(result, "No domains found", 404);
    }
}

module.exports.getDomains = getDomains;