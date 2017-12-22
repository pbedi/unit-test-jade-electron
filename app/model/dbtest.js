let mongoose = require('mongoose');
// to run mongod --dbpath D:\node\myelecexp\data
let Schema = mongoose.Schema;

let DevSchema = new Schema({
  developmentid: { type: Number, required: true },
  name: { type: String, required: true },
  description: String,
  imagepath: String,
  dateCreated: { type: Date, default: Date.now },
  isactive: {type: Boolean , default: 1}
});

// Sets the dateCreated parameter equal to the current time
DevSchema.pre('save', next => {
  now = new Date();
  if(!this.dateCreated) {
    this.dateCreated = now;
  }
  next();
});

//Exports the BookSchema for use elsewhere.
module.exports = mongoose.model('development', DevSchema);
