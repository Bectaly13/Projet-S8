const mysqlConnect = require("./sqlConnect");
const img = require("./sqlConfig").img;

async function getImages(questionIds) {
    // questionIds is an array of number, representing the questions used in the created MCQ.
    const placeholders = questionIds.map(() => '?').join(', ');
    const query = `
        SELECT questionId, path, originalFileName
        FROM ${img}
        WHERE questionId IN (${placeholders})
    `;

    const result = await mysqlConnect.query(query, questionIds);

    // We transform result into a {questionId: [images]} object.
    // [images] is an array containing all the images linked to questionId.
    // Each image contains its path and originalFileName fields.
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