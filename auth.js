const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.authenticate = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email });
      bcrypt.compare(password, user.password, (error, isMatch) => {
        if (error) throw error;
        if (isMatch) {
          resolve(user)
        } else {
          reject('Authentication Failed!');
        }
      })
    } catch (error) {
      reject('Authentication Failed!');
    };
  });
};
