const errorResponse = (res, error, code) => {
    return res.status(code).json({
        success: false,
        message: "Internal server error",
        error: error.message
    });
};

module.exports = errorResponse;