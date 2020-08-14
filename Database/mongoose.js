var mongoose = require('mongoose'); 
mongoose.Promise = global.Promise

mongoose.connect('mongodb+srv://tejasdevs:tejasdevs@cluster0.svck3.mongodb.net/<dbname>?retryWrites=true&w=majority',{ useNewUrlParser: true ,useFindAndModify: false, useUnifiedTopology: true });

module.exports ={mongoose};

