const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'a user must have a name'],
  },
  email: {
    type: String,
    required: [true, 'a user must have an email'],
    unique: true,
    lowercase: true, // transform mail to lowercase
    validate: [validator.isEmail, 'please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm the password'],
    validate: {
      // THIS VALIDATOR WILL ONLY WORK WITH CREATE AND SAVE
      // WILL NOT WORK WITH FIND ONE AND UPDATE
      validator: function (pass) {
        // cannot use arrow function because we need to use this keyword
        return pass === this.password;
      },
      message: 'passwords are not the same',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12); // hash password with cost 12
    this.passwordConfirm = undefined;
  }
  next();
});

userSchema.methods.correctPassword = async (candidatePassword, password) => {
  return await bcrypt.compare(candidatePassword, password);
};
userSchema.methods.changedPasswordAfter = function (JWTtimestamp) {
  if (this.passwordChangedAt) {
    const changeTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return changeTimeStamp > JWTtimestamp;
  }
  return false;
};

const User = mongoose.model('user', userSchema);

module.exports = User;
