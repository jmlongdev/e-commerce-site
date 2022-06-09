const express = require("express");
const bodyParser = require("body-parser"); // parses information and puts it on the req.body property

const app = express();

// Globally lets all route handlers apply this middleware function
// app.use for middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`
  <div>
    <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="password confirmation" />
        <button>Sign Up</button>
    </form>
  </div>
  `);
});

app.post("/", (req, res) => {
  console.log(req.body);
  res.send("Account created!");
});

app.listen(3000, () => {
  console.log("listening");
});
