const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../auth');
const jwt = require('jsonwebtoken');

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
      const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: '15m'
      });
  
      const { iat, exp } = jwt.decode(token);
      res.send({ iat, exp, token });

      next();
    } catch (error) {
      return next(new errors.UnauthorizedError(error));
    }
  });
}