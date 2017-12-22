var mongoose = require('mongoose');
// to run mongod --dbpath D:\node\myelecexp\data
var Development = new mongoose.Schema({
  developmentid: { type: Number, required: true },
  name: { type: String, required: true },
  description: String,
  imagepath: String,
  dateCreated: { type: Date, default: Date.now },
  isactive: {type: Boolean , default: 1}
});
//mongoose.model('Development', Development);
/*var env = process.env.NODE_ENV || 'development';
//console.log('db:'+env);
var path = require('path');
var rootPath = path.normalize(__dirname + '/../');
var envConfig = require(rootPath+'config/env')[env];
//console.log(envConfig);
mongoose.connect('mongodb://'+envConfig.host+'/'+envConfig.database, function(){
  console.log('connected to database');
});*/
module.exports = mongoose.model('Development', Development);
