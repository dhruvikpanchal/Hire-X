const roleMiddleware = (allowedRole) => {
    return (req, res, next) => {
        // Ensure user exists (should run after authMiddleware)
        if (!req.user || !req.user.role) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. User data missing."
            });
        }

        // Check if role matches
        if (req.user.role !== allowedRole) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        next();
    };
};

export default roleMiddleware;
