const { check, validationResult } = require('express-validator');

const loginMiddleware = [
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

module.exports = loginMiddleware;