function sendMessage(res, data) {
    res.status(200).json({data: data});
}

function sendError(res, reason, statusCode = 400) {
    res.status(statusCode).json({reason: reason});
}

module.exports = { sendMessage, sendError };