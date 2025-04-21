const {sendError, sendMessage} = require("./message");
const sql = require("./sql/sqlSkills");

async function getSkills(request, result) {
    const data = request.body;
    console.log("getSkills.js :", data);
    if("chapterId" in data) {
        const res = await sql.getSkills(data["chapterId"]);
        if(res.length) {
            return sendMessage(result, res);
        }
        else {
            return sendError(result, "No skills found", 404);
        }
    }
    else {
        return sendError(result, "Chapter ID is required");
    }
}

module.exports.getSkills = getSkills;