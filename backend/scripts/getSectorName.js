const {sendError, sendMessage} = require("../util/message");
const sql = require("../sql/sqlSectors");

async function getSectorName(request, result) {
    const data = request.body;
    console.log("getSectorName.js :", data);
    if("sectorId" in data) {
        const res = await sql.getSectorName(data.sectorId);
        if(res.length) {
            return sendMessage(result, res);
        }
        else {
            return sendError(result, "Sector name not found");
        }
    }
    else {
        return sendError(result, "Sector ID not given");
    }
}

module.exports.getSectorName = getSectorName;