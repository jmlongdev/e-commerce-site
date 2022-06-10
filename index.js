const express = require("express");
const bodyParser = require("body-parser"); // parses information and puts it on the req.body property
const cookieSession = require("cookie-session");
const usersRepo = require("./repositories/users");

const app = express();

// Globally lets all route handlers apply this middleware function
// app.use for middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["aliksjdbhblakervbiyu"],
  })
);

app.listen(3000, () => {
  console.log("listening");
});
