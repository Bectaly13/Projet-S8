const {sendError, sendMessage} = require("../util/message");
const sql = require("../sql/sqlChoices");

async function getChoices(request, result) {
    const data = request.body;
    console.log("getChoices.js :", data);
    if("questionIds" in data) {
        return sendMessage(result, await sql.getChoices(data["questionIds"]));
    }
    else {
        return sendError(result, "Question IDs are required");
    }
}

module.exports.getChoices = getChoices;