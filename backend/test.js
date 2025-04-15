const {sendError, sendMessage} = require("./message");
const sql = require("./sql/sql");

async function test(request, result) {
    const data = request.body;
    console.log("body :", data);
    if("numero" in data) {
        return sendMessage(result, await sql.getNom(data["numero"]));
    }
    else {
        return sendError(result, "erreur pas numero");
    }
}

module.exports.test = test;