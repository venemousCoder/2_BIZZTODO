const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
