const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/tokenblu')
  .then(db => console.log('Database connected'))
  .catch(err => console.log(err));