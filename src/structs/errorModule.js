function createError(errorCode, errorMessage, messageVars, numericErrorCode, error, statusCode, res) {
    res.set({
        'X-Epic-Error-Name': errorCode,
        'X-Epic-Error-Code': numericErrorCode
    });

    res.status(statusCode).json({
        errorCode,
        errorMessage,
        messageVars,
        numericErrorCode,
        originatingService: "any",
        intent: "prod",
        error_description: errorMessage,
        error
    });
}

module.exports = {
    createError
};
