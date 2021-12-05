const { Schema, model } = require("mongoose");

const schema = new Schema({
  id: Schema.ObjectId,
  login: String,
  password: String,
  firstname: String,
  mail: String,
  avatar: String,
  todos: Array,
  team_member: Boolean,
});

module.exports = model("User", schema);
