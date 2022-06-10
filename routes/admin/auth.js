const usersRepo = require("../../repositories/users");
const express = require("express");
const signUpTemplate = require("../../views/admin/auth/signup");
const signInTemplate = require("../../views/admin/auth/signin");
const router = express.Router();
//Replace app with router. this will link up all the routes back to the index.js
const { check, validationResult } = require("express-validator");

router.get("/signup", (req, res) => {
  res.send(signUpTemplate({ req }));
});

router.post(
  "/signup",
  [
    check("email").trim().normalizeEmail().isEmail(),
    check("password").trim().isLength({ min: 4, max: 20 }),
    check("passwordConfirmation").trim().isLength({ min: 4, max: 20 }),
  ], // these get attached to the req object that will continue to be passed
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    const { email, password, passwordConfirmation } = req.body;
    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) return res.send("Email in use");
    if (password !== passwordConfirmation)
      return res.send("passwords must match");
    // Create a user in our user repo to reperesent this person
    const user = await usersRepo.create({ email, password });
    // Store the id of that user inside the users cookie
    req.session.userId = user.id;
    res.send(`Account created!`);
  }
);

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("you are logged out");
});

router.get("/signin", (req, res) => {
  res.send(signInTemplate());
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const loginUser = await usersRepo.getOneBy({ email });
  if (!loginUser) return res.send("Email not found");
  const validPassword = await usersRepo.comparePasswords(
    loginUser.password,
    password
  );
  if (!validPassword) return res.send("Invalid password");
  req.session.userId = loginUser.id;
  res.send("You are signed in");
});

module.exports = router;
