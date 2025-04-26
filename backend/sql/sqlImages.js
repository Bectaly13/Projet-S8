const mysqlConnect = require("./sqlConnect");
const img = require("./sqlConfig").img;

async function getImages(questionIds) {
    if (!questionIds.length) {
        return {};
    }

    const placeholders = questionIds.map(() => '?').join(', ');
    const query = `
        SELECT questionId, path, originalFileName
        FROM ${img}
        WHERE questionId IN (${placeholders})
    `;

    const result = await mysqlConnect.query(query, questionIds);

    // Transformer en { questionId: [images] }
    const imagesByQuestion = {};

    for (const row of result) {
        if (!imagesByQuestion[row.questionId]) {
            imagesByQuestion[row.questionId] = [];
        }
        imagesByQuestion[row.questionId].push({
            path: row.path,
            originalFileName: row.originalFileName
        });
    }

    return imagesByQuestion;
}

module.exports.getImages = getImages;