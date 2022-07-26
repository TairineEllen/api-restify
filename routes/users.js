const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../auth');

module.exports = server => {
  server.post('/register', (req, res, next) => {
    const { email, password } = req.body;

    const user = new User({ email, password });

    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(user.password, salt, async (error, hash) => {
        user.password = hash;

        try {
          await user.save();
          res.send(201);
          next();
        } catch (error) {
          return next(new errors.InternalError(error.message));
        }
      });
    });
  });

  server.post('/auth', async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const user = await auth.authenticate(email, password);
      console.log(user);
      next();
    } catch (error) {
      return next(new errors.UnauthorizedError(error));
    }
  });
}