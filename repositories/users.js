const fs = require("fs");
const crypto = require("crypto");
// const { threadId } = require("worker_threads");
const util = require("util");
const Repository = require("./repository");
const scrypt = util.promisify(crypto.scrypt);

class UserRepository extends Repository {
  async create(attributes) {
    //attributes === { email: '', password: ''}
    attributes.id = this.randomId();
    const salt = crypto.randomBytes(8).toString("hex");
    const bufferedPw = await scrypt(attributes.password, salt, 64);
    const records = await this.getAll();
    const record = {
      ...attributes,
      password: `${bufferedPw.toString("hex")}.${salt}`,
    };
    records.push(record);
    // write the updates 'array back to this.filename
    await this.writeAll(records);
    return record;
  }

  async comparePasswords(saved, supplied) {
    // Saved -> passqword saved in our database
    // Supplied -> password given to us by the user trying to sign in
    const [hashed, salt] = saved.split(".");
    const bufferHashSupplied = await scrypt(supplied, salt, 64);

    return hashed === bufferHashSupplied.toString("hex");
  }
}
// const test = async () => {
//   const repo = new UserRepository("users.json");
// };
// test();
module.exports = new UserRepository("users.json");
