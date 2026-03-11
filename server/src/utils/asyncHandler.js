export const asyncHandler = (requestHandler) => (req, res, next) => {
    Promise
        .resolve(requestHandler(req, res, next))
        .catch((err) => next(err))
}

/*

// Method - 2 (not recommended)

export const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        res
            .status(error.code || 500)
            .json({
                success: false,
                message: error.message
            })
    }
}

*/


/*

// Method - 3 (recommended and alternative of method - 1 ) 

export const asyncHandler = (fn) => (async (req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (err) {
        next(err);
    }
})

*/