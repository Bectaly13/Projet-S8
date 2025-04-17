const {sendError, sendMessage} = require("./message");
const sql = require("./sql/domains/sqlDomains");

async function getDomainName(request, result) {
    const data = request.body;
    console.log("getDomainName.js :", data);
    if("numero" in data) {
        const res = await sql.getNom(data["numero"]);
        if(res.length) {
            return sendMessage(result, await sql.getNom(data["numero"]));
        }
        else {
            return sendError(result, "domain NOT FOUND", 400);
        }
    }
    else {
        return sendError(result, "numero field NOT FOUND", 400);
    }
}

module.exports.getDomainName = getDomainName;