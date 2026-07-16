const { body, validationResult } = require("express-validator");

const validateUser=[
    body('name')
    .trim()
    .notEmpty().withMessage('Name is required!')
    .isLength({min: 2, max: 50}).withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can contain only letters and spaces'),

    body('email')
    .trim()
    .notEmpty().withMessage('Email is required!')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

    body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({min: 6}).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/).withMessage('Password must contain at least one letter, one number, and one symbol')
];

const handleValidationErrors=(req,res,next)=>{
    const errors=validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            errors: errors.array().map(error=>({
                field: error.path,
                message: error.msg
            }))
        });
    }
    next();
}

module.exports={validateUser, handleValidationErrors};