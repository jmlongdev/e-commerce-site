app.get("/signup", (req, res) => {
  res.send(`
    <div>
    Your id is: ${req.session.userId}
      <form method="POST">
          <input name="email" placeholder="email" required />
          <input name="password" placeholder="password" required />
          <input name="passwordConfirmation" placeholder="password confirmation" required />
          <button>Sign Up</button>
      </form>
    </div>
    `);
});

app.post("/signup", async (req, res) => {
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
});

app.get("/signout", (req, res) => {
  req.session = null;
  res.send("you are logged out");
});

app.get("/signin", (req, res) => {
  res.send(`
    <div>
      <form method="POST">
          <input name="email" placeholder="email" required />
          <input name="password" placeholder="password"  required />
          <button>Sign In</button>
      </form>
    </div>
    `);
});

app.post("/signin", async (req, res) => {
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
