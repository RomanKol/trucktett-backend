// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var gameSchema = new Schema({
	players: [],
  round: { type: Number, default: 10 }
});


gameSchema.methods.ready = function(cb) {
  if (this.players.length == 2) {
    return true;
  } else {
    return false;
  }
};

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('game', gameSchema);