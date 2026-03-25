import { ApiError } from "../utils/ApiError.js";

const roleMiddleware = (allowedRole) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return next(new ApiError(401, "Not authorized. User data missing."));
        }

        if (req.user.role !== allowedRole) {
            return next(new ApiError(403, "Access denied"));
        }

        next();
    };
};

export default roleMiddleware;
