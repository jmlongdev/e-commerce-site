const layout = require("../layout");

module.exports = ({ req }) => {
  return layout({
    content: `
  <div>
    Your id is: ${req.session.userId}
    <form method="POST">
      <input name="email" placeholder="email" required />
      <input name="password" placeholder="password" required />
      <input name="passwordConfirmation" placeholder="password confirmation" required />
      <button>Sign Up</button>
    </form>
  </div>
    `,
  });
};
