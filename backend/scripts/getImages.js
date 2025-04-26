const {sendError, sendMessage} = require("../util/message");
const sql = require("../sql/sqlImages");

async function getImages(request, result) {
    const data = request.body;
    console.log("getImages.js :", data);
    if("questionIds" in data) {
        return sendMessage(result, await sql.getImages(data["questionIds"]));
    }
    else {
        return sendError(result, "Question IDs are required");
    }
}

module.exports.getImages = getImages;