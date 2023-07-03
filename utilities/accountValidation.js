const utilities = require(".")
const accountModel = require("../models/accountModel")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
    return [
        // firstname is required and must be string 
        body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name. "), // on error this message is sent.

        // valid email is required and cannot already exist in the DB
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (emailExists){
                throw new Error("Email exists. Please log in or use different email")
            }
        }),

        // password is required and must be strong password
        body("account_password")
        .trim()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements. "),

    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
     let nav = await utilities.getNav()
     res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
     })
     return
    }
    next()
}

/*  **********************************
 *  Form Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
    return [
        // valid email is required and cannot already exist in the DB
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required."),

          // password is required and must be strong password
          body("account_password")
          .isLength({ min: 12 })
          .withMessage("Please, type your password. "),

    ]
}

/* ******************************
 * Check data and return errors or continue login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email, account_password } = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
     let nav = await utilities.getNav()
     res.render("account/login", {
        errors,
        title: "Login",
        nav,
        account_email,
        account_password,
     })
     return
    }
    next()
}


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
     let nav = await utilities.getNav()
     res.render("./account/update", {
        errors,
        title: "Edit Account",
        nav,
        account_firstname,
        account_lastname,
        account_email,
        account_id,
     })
     return
    }
    next()
}

/*  **********************************
 *  Update Validation Rules
 * ********************************* */
validate.updateRules = () => {
    return [
        // firstname is required and must be string 
        body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name. "), // on error this message is sent.

         // valid email is required and cannot already exist in the DB
         body("account_email")
         .trim()
         .isEmail()
         .normalizeEmail() // refer to validator.js docs
         .withMessage("A valid email is required.")
         .custom(async (account_email, {req}) => {
            const getaccount = await accountModel.getAccountById(req.body.account_id)         
             if (getaccount.account_email != account_email){
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists){
                    throw new Error("This email is already used. Please enter another.")
                }
             }
         })


    ]
}

/*******************
 * Update password rules
 *******************/
validate.upPassRules = () => {
    return [

        //account id is required and must be an integer
        body("account_id")
        .trim()
        .isInt(),

        //password is required and must be a strong password
        body("account_password")
        .trim()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
 * Check data and return errors or continue to update password
 * ***************************** */
validate.checkPassData = async (req, res, next) => {
    const { account_id, account_password } = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
     let nav = await utilities.getNav()
     res.render("./account/update", {
        errors,
        title: "Edit Account",
        nav,
        account_id,
        account_password,
     })
     return
    }
    next()
}

/*  **********************************
 *  New Message Validation Rules
 * ********************************* */
validate.newMessageRules = () => {
    return [

    body("message_to")
    .isNumeric({min: 1})
    .withMessage("Please, choose a recipient."),
    
    body("message_subject")
    .isLength({min: 3})
    .withMessage("Subject field does not meet requirements"),

    body("message_body")
    .isLength({min: 3})
    .withMessage("Message field does not meet requirements"),

    body("account_id")
    .isNumeric({min: 1})
    .withMessage("Account Id does not meet requirements")
    ]
}

/*  **********************************
 *  Check data and return errors or continue to create New Message
 * ********************************* */
validate.checkNewMessage = async (req, res, next) => {
const { message_to, message_subject, message_body, account_id } = req.body
let errors = []
errors = validationResult(req)
if(!errors.isEmpty()) {
let nav = await utilities.getNav()
let options = await utilities.buildAccountOptions(account_id)
res.render("./account/newMessage", {
errors,
title: "New Message",
nav,
options, 
message_to,
message_subject,
message_body,
account_id,  
})
return
}
next()
}


module.exports = validate