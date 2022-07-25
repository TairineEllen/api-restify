require('dotenv-safe').config();
const restify = require('restify');
const mongoose = require('mongoose');

const server = restify.createServer();

server.use(restify.plugins.bodyParser());

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
