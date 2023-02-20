const mongoose = require("mongoose");

const regSchema = mongoose.Schema({
  name: String,
  email: String,
  gender: String,
  password: String,
  age: Number,
  city: String,
});

const UserModel = mongoose.model("user", regSchema);

module.exports = {
  UserModel,
};
