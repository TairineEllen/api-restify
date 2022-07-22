const errors = require('restify-errors');
const Customer = require('../models/Customer');

module.exports = server => {
  server.get('/customers', async (req, res, next) => {
    try {
      const customers = await Customer.find({});
      res.send(customers);
      next();
    } catch(error) {
      return next(new errors.InvalidContentError(error));
    }
  });
};
