const errorResponse = (res, error) => {
    return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
    });
};

module.exports = errorResponse;