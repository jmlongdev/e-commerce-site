const express = require("express");
const bodyParser = require("body-parser"); // parses information and puts it on the req.body property
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth");
const app = express();

// Globally lets all route handlers apply this middleware function
// app.use for middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["aliksjdbhblakervbiyu"],
  })
);
//add after the middlewares
app.use(authRouter);

app.listen(3000, () => {
  console.log("listening");
});
