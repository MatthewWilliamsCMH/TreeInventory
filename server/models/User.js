const { Schema, model } = require('mongoose');

//define the schema for the User model
const userSchema = new Schema({
  userName: { type: String, required: true },
  passwordHash: { type: String, required: true },
});

const User = model('User', userSchema);

module.exports = User;
