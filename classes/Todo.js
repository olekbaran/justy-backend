const shortid = require("shortid");
module.exports = class Todo {
  constructor(title, description, options) {
    this.id = options.item_id || shortid.generate();
    this.done = options.done || false;
    this.title = title;
    this.description = description;
    this.category = options.category;
    this.endDate = options.endDate;
    this.createdAt = Date.now();
  }
};
