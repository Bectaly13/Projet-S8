const {sendError, sendMessage} = require("../util/message");
const sql = require("../sql/sqlSectors");

async function getSectors(request, result) {
    const data = request.body;
    console.log("getSectors.js :", data);
    const res = await sql.getSectors();
    if(res.length) {
        return sendMessage(result, res);
    }
    else {
        return sendError(result, "No sectors found");
    }
}

module.exports.getSectors = getSectors;