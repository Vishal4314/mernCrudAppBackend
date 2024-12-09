const mongoose = require("mongoose");
const validator = require("validator");

const usersSchema = new mongoose.Schema({
  fName: {
    type: String,
    required: true,
    trim: true,
  },
  lName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw Error("Invalid Email");
      }
    },
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    minLength: 10,
    maxLength: 10,
  },
  gender: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  dateCreated: Date,
  dateUpdated: Date,
});

const users = new mongoose.model("users", usersSchema);

module.exports = users;
