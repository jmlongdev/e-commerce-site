module.exports = {
  // helper funciton to handle if there is an error
  getError: (errors, prop) => {
    // prop can be === to 'email', 'password', or 'passwordConformation'
    // the totally correct way to handle this is to use a series of if statements
    // but try catch works for now.
    try {
      return errors.mapped()[prop].msg; // returns an object with sub-objects nested
    } catch (err) {
      return "";
    }
  },
};
