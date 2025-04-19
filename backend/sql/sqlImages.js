const mysqlConnect = require("./sqlConnect");
const img = require("./sqlConfig").img;

async function getQuestionImages(questionId) {
    const query = `SELECT path
        FROM ${img}
        WHERE questionId = ?`;
    
    data = [questionId];
    return await mysqlConnect.query(query, data);
}

module.exports.getQuestionImages = getQuestionImages;