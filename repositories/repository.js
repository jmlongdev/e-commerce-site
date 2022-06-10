const fs = require("fs");
const crypto = require("crypto");
const util = require("util");

module.exports = class Repository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a repository requires a filename");
    }
    //ensuring that the file exists on hdd
    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  async create(attributes) {
    attributes.id = this.randomId();
    const records = this.getAll();
    records.push(attributes);
    await this.writeAll(records);
    return attributes;
  }

  async getAll() {
    //  open file, parse contents, return parsed data
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf8",
      })
    );
  }

  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  async update(id, attributes) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);
    if (!record) throw new Error(`Record with is ${id} not found`);
    // records === {email: 'test@test.com'}
    // attributes === {password: 'mypassword'}
    Object.assign(record, attributes);
    // records === {email: 'test@test.com', password: 'mypassword'}
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();
    for (let record of records) {
      let found = true;

      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return record;
      }
    }
  }
};
