const layout = require("../layout");
const { getError } = require("../../helpers");

module.exports = ({ errors }) => {
  return layout({
    content: `
  <div>
    <form method="POST">
      <input name="email" placeholder="email" required />
      ${getError(errors, "email")}
      <input name="password" placeholder="password"  required />
      ${getError(errors, "password")}
      <button>Sign In</button>
    </form>
  </div>
  `,
  });
};
