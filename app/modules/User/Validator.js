/****************************
 Validators
 ****************************/
const _ = require("lodash");
let i18n = require("i18n");
const { validationResult } = require('express-validator');
const { body, check, query, header, param } = require('express-validator');

var commonlyUsedPasswords = require('../../../configs/commonlyUsedPassword.json').passwords;

class Validators {

    /********************************************************
   Purpose: Social Access validator
   Parameter:
   {}
   Return: JSON String
   ********************************************************/
    static socialAccessValidator() {
        try {
            return [
                check('socialId').exists().withMessage(i18n.__("%s REQUIRED", 'socialId')),
                check('socialKey').exists().withMessage(i18n.__("%s REQUIRED", 'socialKey')),
            ];
        } catch (error) {
            return error; 
        }
    }
    /********************************************************
     Purpose:Function for login validator
     Parameter:
     {}
     Return: JSON String
     ********************************************************/
    static loginValidator() {
        try {
            return [
                ...this.emailValidator(),
                ...this.passwordValidator({ key: 'password' })
            ];
        } catch (error) {
            throw new Error(error);
        }
    }
    /********************************************************
     Purpose:Function for signup validator
     Parameter:
     {}
     Return: JSON String
     ********************************************************/
    static userSignupValidator() {
        try {
            return [
                ...this.emailValidator(),
                ...this.userNameValidator(),
                ...this.basicInfoValidator(),
                ...this.passwordValidator({ key: 'password' })
            ];
        } catch (error) {
            return error;
        }
    }
    /********************************************************
     Purpose:Function for reset password validator
     Parameter:
     {}
     Return: JSON String
     ********************************************************/
    static resetPasswordValidator() {
        try {
            return [
                check('token').exists().withMessage(i18n.__("%s REQUIRED", 'Token')),
                ...this.passwordValidator({ key: 'password' })
            ];
        } catch (error) {
            return error;
        }
    }
    /********************************************************
     Purpose:Function for password validator
     Parameter:
     {}
     Return: JSON String
     ********************************************************/
    static passwordValidator(keyObj = { key: 'password' }) {
        try {
            return [
                check(keyObj.key)
                    .not().isIn(commonlyUsedPasswords).withMessage(i18n.__("COMMONLY_USED_PASSWORD"))
                    .isLength({ min: 8 }).withMessage(i18n.__("PASSWORD_VALIDATION_LENGTH"))
                    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d].*/).withMessage(i18n.__("PASSWORD_VALIDATION"))
            ];
        } catch (error) {
            return error;
        }
    }
    /********************************************************
     Purpose:Function for email validator
     Parameter:
     {}
     Return: JSON String
     ********************************************************/
    static emailValidator() {
        try {
            return [check('emailId').isEmail().withMessage(i18n.__("VALID_EMAIL"))];
        } catch (error) {
            return error;
        }
    }
    /********************************************************
     Purpose:Function for email validator
     Parameter:
     {}
     Return: JSON String
     ********************************************************/
    static userNameValidator() {
        try {
            return [check('username').exists().withMessage(i18n.__("%s REQUIRED", 'Username'))];
        } catch (error) {
            return error;
        }
    }
    /********************************************************
     Purpose:Function for basic info validator
     Parameter:
     {}
     Return: JSON String
     ********************************************************/
    static basicInfoValidator() {
        try {
            return [
                check('firstname').exists().withMessage(i18n.__("%s REQUIRED", 'Firstname')),
                check('lastname').exists().withMessage(i18n.__("%s REQUIRED", 'Lastname')),
                check('mobile').exists().withMessage(i18n.__("%s REQUIRED", 'Mobile'))
            ];
        } catch (error) {
            return error;
        }
    }
    /********************************************************
     Purpose: Function for change password validator
     Parameter:
     {}
     Return: JSON String
     ********************************************************/
    static changePasswordValidator() {
        try {
            return [
                check('oldPassword').exists().withMessage(i18n.__("%s REQUIRED", 'Current password')),
                ...this.passwordValidator({ key: 'newPassword' })
            ];
        } catch (error) {
            return error;
        }
    }
    /********************************************************
     Purpose:Function for update user validator
     Parameter:
     {}
     Return: JSON String
     ********************************************************/
    static updateUserValidator() {
        try {
            return [
                ...this.basicInfoValidator(),
                ...this.userNameValidator()
            ];
        } catch (error) {
            return error;
        }
    }
    /********************************************************
     Purpose:Function for update user validator
     Parameter:
     {}
     Return: JSON String
     ********************************************************/
    static verifyUserValidator() {
        try {
            return [
                query('token').isString().withMessage(i18n.__("%s REQUIRED", 'Token')).trim()
            ];
        } catch (error) {
            return error;
        }
    }
    static validate(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ status: 0, message: errors.array() });
            }
            next();
        } catch (error) {
            return res.send({ status: 0, message: error });
        }
    }
}

module.exports = Validators;