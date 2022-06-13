const usersRepo = require("../../repositories/users");
const express = require("express");
const signUpTemplate = require("../../views/admin/auth/signup");
const signInTemplate = require("../../views/admin/auth/signin");
const router = express.Router();
//Replace app with router. this will link up all the routes back to the index.js
const { handleErrors } = require("./middlewares");

const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExist,
  requireValidPassword,
} = require("./validators");

router.get("/signup", (req, res) => {
  res.send(signUpTemplate({ req }));
});

router.post(
  "/signup",
  [requireEmail, requirePassword, requirePasswordConfirmation], // these get attached to the req object that will continue to be passed
  handleErrors(signUpTemplate),
  async (req, res) => {
    const { email, password } = req.body;
    // Create a user in our user repo to reperesent this person
    const user = await usersRepo.create({ email, password });
    // Store the id of that user inside the users cookie
    req.session.userId = user.id;
    res.redirect("/admin/products");
  }
);

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("you are logged out");
});

router.get("/signin", (req, res) => {
  res.send(signInTemplate({}));
});

router.post(
  "/signin",
  [requireEmailExist, requireValidPassword],
  handleErrors(signInTemplate),
  async (req, res) => {
    const { email } = req.body;
    const loginUser = await usersRepo.getOneBy({ email });
    req.session.userId = loginUser.id;
    res.redirect("/admin/products");
  }
);

module.exports = router;
