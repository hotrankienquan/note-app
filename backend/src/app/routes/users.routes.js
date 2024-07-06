const { body, validationResult } = require("express-validator");
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../middlewares/catchAll");
const userController = require("../controllers/user.controller");
const {
  userRegisterValidationRules,
  loginValidationRules,
  validateAddNote,
} = require("../validations/api-v1/userValidation");
const db = require("../models");

const router = require("express").Router();

const { BadRequestError } = require("../../core/error.response");

module.exports = (app) => {
  // Middleware to handle validation errors
  const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      throw new BadRequestError(JSON.stringify(errors.array()))
    }
    next();
  };

  const isAdmin = async (req, res, next) => {
    const result = await db.users.findOne({
      where: {
        id: req.keyStore.userId
      }

    })

    if(!result){
      throw new BadRequestError("errr")
    }

    if(Array.isArray(result?.role) && !result.role.includes("admin")) {
      return res.status(400).json({ errors: "error not admin"});
    }
    next()
  }

  
  router.post(
    "/register",
    userRegisterValidationRules(),
    validateRequest,
    asyncHandler(userController.signUp)
  );

  router.post(
    "/login",
    loginValidationRules(),
    validateRequest,
    asyncHandler(userController.login)
  );

  router.get("/getall", asyncHandler(userController.getall));

  router.use(authentication);

  router.post("/logout", asyncHandler(userController.logout));

  // note route integrate
  router.post(
    "/add-note",
    validateAddNote(),
    validateRequest,
    asyncHandler(userController.addNote)
  );
  router.post("/edit-note",validateAddNote(), validateRequest, asyncHandler(userController.editNote))
  router.get("/get-note-of-user", asyncHandler(userController.getNoteOfUser))

  router.get("/get-all-note-by-admin", isAdmin, asyncHandler(userController.getAllNoteByAdmin))
  
  app.use("/v1", router);
};
