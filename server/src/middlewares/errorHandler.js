import { ApiError } from "../utils/ApiError.js";

/**
 * Central error handler. Place after all routes in app.js.
 */
export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errors = Array.isArray(err.errors) ? err.errors : [];

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors;
    } else if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    } else if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyPattern || {})[0];
        message = field ? `${field} already exists` : "Duplicate field value";
    } else if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation failed";
        errors = Object.values(err.errors || {}).map((e) => e.message);
    } else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    } else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    } else if (err.name === "MulterError") {
        statusCode = 400;
        message =
            err.code === "LIMIT_FILE_SIZE"
                ? "File too large (max 5 MB)"
                : err.message || "File upload error";
    } else if (
        typeof err.message === "string" &&
        (err.message.includes("Resume must be") ||
            err.message.includes("Image must be") ||
            err.message.includes("Unknown file field"))
    ) {
        statusCode = 400;
        message = err.message;
    }

    const body = {
        success: false,
        message,
    };
    if (errors.length > 0) {
        body.errors = errors;
    }
    if (process.env.NODE_ENV !== "production" && !(err instanceof ApiError)) {
        body.error = err.message;
    }

    res.status(statusCode).json(body);
};
