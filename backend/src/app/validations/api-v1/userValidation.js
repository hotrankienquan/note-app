const { body } = require("express-validator");
const loginValidationRules = () => {
  return [
    body("password")
      .notEmpty()
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be between 8 and 20 characters"),
    body("email")
      .notEmpty()
      .isEmail()
      .withMessage("Invalid email address")
      .isLength({ min: 5 })
      .withMessage("Email must be at least 5 characters"),
  ]
}
const userRegisterValidationRules = () => {
  return [
    body("username")
      .notEmpty()
      .isLength({ min: 3, max: 20 })
      .withMessage("username length must be from 3 to 20"),
    body("password")
      .notEmpty()
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be between 8 and 20 characters"),
    body("email")
      .notEmpty()
      .isEmail()
      .withMessage("Invalid email address")
      .isLength({ min: 5 })
      .withMessage("Email must be at least 5 characters"),
  ];
};
const validateAddNote = () => {
  return [
    body("title")
    .notEmpty()
    .isLength({min:3, max:20})
    .withMessage("tieu de co min la 3, max la 20 ki tu")
    .exists()
    .isString()
    .custom((value) => {
      if(String(value).includes('@')){
        return Promise.reject("khong dc chua ki tu @")
      }
      return true;
    }),
    body("content")
    .notEmpty()
    .isLength({min:3, max:1000})
    .withMessage("tieu de co min la 3, max la 1000 ki tu")
    .exists()
    .isString()
  ]
}

module.exports = {
  userRegisterValidationRules,
  loginValidationRules,
  validateAddNote
}