module.exports.health = async (event, context, callback) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            "status": "RSVP app OK"
        }),
    };

    callback(null, response);
}
