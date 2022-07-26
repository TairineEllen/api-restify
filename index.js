require('dotenv-safe').config();
const restify = require('restify');
const mongoose = require('mongoose');
const rjwt = require('restify-jwt-community');

const server = restify.createServer();

server.use(restify.plugins.bodyParser());

server.use(rjwt({ secret: process.env.JWT_SECRET}).unless({ path: ['/auth'] }));

server.listen(process.env.PORT, () => {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
});

const db = mongoose.connection;

db.on('error', (error) => console.log(error));
db.once('open', () => {
  require('./routes/customers')(server);
  require('./routes/users')(server);
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
