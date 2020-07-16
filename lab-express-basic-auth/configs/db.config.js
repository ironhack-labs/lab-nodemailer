const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/lab-nodemailer', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));


  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose disconnected')
      process.exit(0)
    })
  })