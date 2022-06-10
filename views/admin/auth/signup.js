const layout = require("../layout");
const { getError } = require("../../helpers");

module.exports = ({ req, errors }) => {
  return layout({
    content: `
  <div>
    Your id is: ${req.session.userId}
    <form method="POST">
      <input name="email" placeholder="email" required />
      ${getError(errors, "email")}
      <input name="password" placeholder="password" required />
      ${getError(errors, "password")}
      <input name="passwordConfirmation" placeholder="password confirmation" required />
      ${getError(errors, "passwordConfirmation")}
      <button>Sign Up</button>
    </form>
  </div>
    `,
  });
};
