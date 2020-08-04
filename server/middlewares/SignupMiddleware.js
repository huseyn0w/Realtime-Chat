const { check, validationResult } = require('express-validator');


const signUpMiddleware = [
    check('fullName')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Full Name field can not be empty!')
    .bail()
    .isLength({
        min: 3
    })
    .withMessage('Full Name should have 3 characters!')
    .bail(),
    check('email')
    .trim()
    .normalizeEmail()
    .not()
    .isEmpty()
    .withMessage('Invalid email address!')
    .bail(),
    check('password')
    .not()
    .isEmpty()
    .withMessage('Password can not be empty!')
    .isLength({
        min: 8
    })
    .withMessage('Password should have minimum 8 characters!')
    .bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({
                errors: errors.array()
            });
        next();
    },
];

module.exports = signUpMiddleware;