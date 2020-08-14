var mongoose = require('mongoose'); 
mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost:27017/User',{ useNewUrlParser: true ,useFindAndModify: false, useUnifiedTopology: true });

module.exports ={mongoose};

