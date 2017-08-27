// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose'),
	crypto = require('crypto'),
	salt = require('../../config.js').secret,
	Schema = mongoose.Schema;

var userSchema = new Schema({
	_mail: { type: String, required: true },
	_password: { type: String, required: true },
	username: { type: String, required: true, unique: true },
	truck: { type: String, default: '' },
	motto: { type: String, default: '' },
	attributes: {
		km: { type: Number, default: null },
		jam: { type: Number, default: null },
		ranking: { type: Number, default: null },
		games: { type: Number, default: null },
		weight: { type: Number, default: null },
		eco: { type: Number, default: null },
		v: { type: Number, default: null },
		tank: { type: Number, default: null }
	},
	about: {
		route: { type: String, default: '' },
		station: { type: String, default: '' },
		dish: { type: String, default: '' },
		coffee: { type: Number, default: null }
	},
	friends: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}]
  	},
	deck: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}],
		validate: [deckSize, '{PATH} needs to be the size 20']
	},
	loc: {
		type: [Number],
		index: '2d'
	},
	lastUpdate: Date
});

userSchema.pre('save', function (next) {
	// Update LastUpdate
	this.lastUpdate = new Date();

	// Check if Password has been modified
	if(!this.isModified('_password')) return next();

	this._password = crypto.createHmac('md5', salt).update(this._password).digest('hex');
	next();

	// Additional Auth to prevent userdata manipulation
	// ToDo
	//
});

userSchema.methods.authenticate = function(password, cb) {
  if (this._password == crypto.createHmac('md5', salt).update(password).digest('hex')) {
		return true;
	} else {
		return false;
	}
};

function deckSize(val) {
  return val.length <= 20;
}

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', userSchema);