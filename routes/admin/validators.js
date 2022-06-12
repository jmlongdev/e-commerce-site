const { check, validationResult } = require("express-validator");
const usersRepo = require("../../repositories/users");

module.exports = {
  requireTitle: check("title")
    .trim()
    .isLength({ min: 5, max: 40 })
    .withMessage("Must be between 5 and 40 characters"),

  requirePrice: check("price")
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage("Please enter a price greater than $1"),

  requireEmail: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email")
    .custom(async (email) => {
      const existingUser = await usersRepo.getOneBy({ email });
      if (existingUser) throw new Error("Email in use");
    }),

  requirePassword: check("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Must be between 4 and 20 characters"),

  requirePasswordConfirmation: check("passwordConfirmation")
    .trim()
    .isLength({ min: 4, max: 20 })
    .custom((passwordConfirmation, { req }) => {
      if (req.body.password !== passwordConfirmation) {
        throw new Error("Passwords must match");
      } else return true;
    }),

  requireEmailExist: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must provide a valid email")
    .custom(async (email) => {
      const loginUser = await usersRepo.getOneBy({ email });
      if (!loginUser) throw new Error("Email not found");
    }),

  requireValidPassword: check("password")
    .trim()
    .custom(async (password, { req }) => {
      const loginUser = await usersRepo.getOneBy({ email: req.body.email });
      if (!loginUser) {
        throw new Error("Invalid");
      }
      const validPassword = await usersRepo.comparePasswords(
        loginUser.password,
        password
      );
      if (!validPassword) {
        throw new Error("Invalid password");
      }
    }),
};
