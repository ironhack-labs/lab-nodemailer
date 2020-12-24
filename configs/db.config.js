const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/lab-nodemailer', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch(err => {
    console.error('Error connecting to mongo', err);
  });


process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose terminated');
    process.exit(0);
  });
});