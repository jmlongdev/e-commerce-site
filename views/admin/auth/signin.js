const layout = require("../layout");

module.exports = () => {
  return layout({
    content: `
  <div>
    <form method="POST">
      <input name="email" placeholder="email" required />
      <input name="password" placeholder="password"  required />
      <button>Sign In</button>
    </form>
  </div>
  `,
  });
};
