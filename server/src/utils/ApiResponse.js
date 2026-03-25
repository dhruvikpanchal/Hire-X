/**
 * Standard success payload: { success: true, ...data }
 * Pass all fields (message, token, user, etc.) in `data` to match existing API shapes.
 */
class ApiResponse {
    constructor(statusCode, data = {}) {
        this.statusCode = statusCode;
        this.data = data;
    }

    toJSON() {
        return {
            success: this.statusCode < 400,
            ...this.data,
        };
    }
}

/**
 * @param {import('express').Response} res
 * @param {ApiResponse} apiResponse
 */
export function sendResponse(res, apiResponse) {
    res.status(apiResponse.statusCode).json(apiResponse.toJSON());
}

export { ApiResponse };
