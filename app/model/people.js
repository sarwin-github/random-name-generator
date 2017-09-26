let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//PeopleSchema definition
let PeopleSchema = new Schema({
  name     : String,
  age      : String,
  address  : String,
  country  : String,  
  birthday : String,
  createdAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
PeopleSchema.pre('save', next => {
  now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

//Exports the PeopleSchema for use elsewhere.
module.exports = mongoose.model('People', PeopleSchema);