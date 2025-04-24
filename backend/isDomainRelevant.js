const {sendError, sendMessage} = require("./message");
const sql = require("./sql/sqlDomains");

async function isDomainRelevant(request, result) {
    const data = request.body;
    console.log("isDomainRelevant.js :", data);
    if("domainId" in data) {   
        if("sectorId" in data) {
            if("mcqSize" in data) {
                return sendMessage(result, await sql.isDomainRelevant(data["domainId"], data["sectorId"], data["mcqSize"]));
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

module.exports.isDomainRelevant = isDomainRelevant;