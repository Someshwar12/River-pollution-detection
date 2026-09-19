// server/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    // Determine the status code based on what was set, or default to 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    // Send a JSON response with the error details
    res.json({
        message: err.message,
        // Only include the stack trace in development mode for security
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
module.exports = errorHandler;