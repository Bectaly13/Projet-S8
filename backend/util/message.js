// These two methods are used to send data to the frontend.
// It can be a message (status = 200) containing useful data,
// or an error containing an explanation.

function sendMessage(res, data) {
    res.status(200).json({data: data});
}

function sendError(res, reason, statusCode = 400) {
    res.status(statusCode).json({reason: reason});
}

module.exports = { sendMessage, sendError };