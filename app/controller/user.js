var fs = require('fs'),
	User = require('../models/user');

//
// /users
//

// Create User
// REQ JSON: username, password, mail
// RES JSON: user / error
exports.createUser = function (req, res) {

	// Create new user instance and insert data
	var newUser = User({
		_mail: req.body.mail,
		_password: req.body.password,
		username: req.body.username
	});

	// Save new User
	newUser.save(function (err, user) {

		// Responde with error
		if(err){
			res.json({error: err});
		// or user
		} else {
			res.json(user);
		}

	});
}

//
// /users/:id
//

// Get User By Id
// RES: user / error
exports.getUser = function (req, res) {

	User.findById(req.params.id, '-_mail -_password', function (err, user) {

		if (err) {
			res.json({error: err});
		} else {
			if (user) {
				res.json(user);
			} else {
				res.json({error: 'Wrong ID'});
			}
		}

	});
}

// Update User
// REQ JSON: firstname, surname, password, mail
// RES JSON: message / error
exports.updateUser = function (req, res) {

	User.findByIdAndUpdate(req.params.id, {
		_password: req.body.password,
		_mail: req.body.mail,
		username: req.body.username,
	}, {
		new: true,
		select: '_mail username'
	}, function (err, user) {

		if (err) {
			res.json(err);
		} else {
			if (user) {
				res.json(user);
			} else {
				res.json({message: 'Wrong ID'});
			}
		}

	});
}

// Delete User
// RES JSON: message / error
exports.deleteUser = function (req, res) {

	User.findByIdAndRemove(req.params.id, function (err, user) {

		if (err) {
			res.json({error: err});
		} else {
			if (user) {
				res.json({message: 'Removed User'});
			} else {
				res.json({error: 'Wrong ID'});
			}
		}

	});
}


//
// /users/:id/profile
//

// Get User Profile
// RES JSON: profile / error
exports.getUserProfile = function (req, res) {

	User.findById(req.params.id, 'username truck motto attributes about', function (err, user) {

		if (err) {
			res.json({error: err});
		} else {
			if (user) {
				res.json(user);
			} else {
				res.json({error: 'Wrong ID'});
			}
		}

	});
}

// Update User Profile
// REQ JSON: profile
// RES JSON: profile / error
exports.updateUserProfile = function (req, res) {

	User.findByIdAndUpdate(req.params.id, {
		$set: {
			_username: req.body.username,
			truck: req.body.truck,
			motto: req.body.motto,
			about: req.body.about
		}
	}, {new: true, select: 'username truck motto attributes about'}, function (err, user) {

		if (err) {
			res.json(err);
		} else {
			if (user) {
				res.json(user);
			} else {
				res.json({message: 'Wrong ID'});
			}
		}

	});
}

// Update User Profile Attributes
// REQ JSON: route, station, dish, coffee
// RES JSON: profile / error
exports.updateUserAttributes = function (req, res) {
	User.findByIdAndUpdate(req.params.id, {
		attributes: req.body
	}, {
		new: true,
		select: 'attributes'
	}, function (err, attributes) {
		if (err) {
			res.json(err);
		} else {
			if (attributes) {
				res.json(attributes.attributes);
			} else {
				res.json({error: 'Wrong ID'});
			}
		}
	});
}

// Get User Card
exports.getUserCard = function (req, res) {

	User.findById(req.params.id, function (err, user) {

		if (err) {
			res.json({error: err});
		} else {
			if (user) {

				var profile = {
					_id: user._id,
					username: user.username,
					truck: user.truck,
					motto: user.motto,
					attributes: user.attributes,
				}

				res.json(profile);
			} else {
				res.json({error: 'Wrong ID'});
			}
		}

	});
};

// Get User Image by Id
// RES: Image
exports.getUserImage = function (req, res) {

	var file = global.images + req.params.id + '.png';

	var options = {
		root: global.images,
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};

	fs.access(file, fs.F_OK, function (err) {
		if (!err) {
			res.sendFile(file);
		} else {
			var placeholder = global.images + 'placeholder.png';
			fs.access(global.images, fs.F_OK, function (err) {
				res.sendFile(placeholder);
			});

		}
	});
}

// ToDo
// Update User Image
exports.updateUserImage	= function (req, res) {
	console.log(req.files);
	res.json({message: 'File Uploading'});
}

// Update User Location
// RES: loc[]
exports.updateUserLoc = function (req, res) {

	User.findByIdAndUpdate(req.params.id, {loc: req.body}, function (err, user) {
		if (err) {
			res.json({err: err});
		} else {
			if (user) {
				res.json(user.loc);
			}
		}
	});
}

// Get Users
// Dev only
exports.getUsers = function (req, res) {

	User.find({}, '-password', function (err, users) {
		res.json(users);
	});
}

// Get Users nearby position
// RES
exports.getUsersNearby = function (req, res) {

	// Distance in km
	var maxDistance = req.query.distance || req.headers['distance'] || 10;
		maxDistance /= 6371;

	var coords = [];
		coords[0] = req.query.lng || req.headers['lng'];
		coords[1] = req.query.lat || req.headers['lat'];

	User.find({
		loc: {
			$near: coords,
			$maxDistance: maxDistance
		}
	}, '_id username truck motto loc', function (err, users) {
		if (err) {
			return res.json(err);
		} else {
			if (users) {
				res.json(users);
			}
		}
	});
}

// Get User Friends
// RES JSON: friends / error
// Get User Friendlist by ID
exports.getUserFriends = function (req, res) {


	User.findById(req.params.id)
		.populate({
			path: 'friends',
			select: 'username motto'
		})
		.exec(function (err, user) {
			if (err) {
				res.json({err: err});
			} else {
				if (user.friends.length > 0) {
					res.json(user.friends);
				} else {
					res.json({err: 'No friends'})
				}
			}
		});
}

// Clear User Friendlist
exports.removeUserFriends = function (req, res) {

	User.findByIdAndUpdate(req.params.id, {
		$set: {
			friends: []
		}
	}, {
		new: true,
		select: 'friends'
	}, function (err, friends) {

		if (err) {
			res.json({error: err});
		} else {
			if (friends) {
				res.json(friends);
			} else {
				res.json({message: 'Wrong ID'});
			}
		}

	});
}

// Add friend
// RES JSON: friends / error
exports.addUserFriend = function (req, res) {

	User.findByIdAndUpdate(req.params.id, {
		$addToSet: {
			friends: req.params.friend
		}
	}, {
		new: true,
		select: 'friends'
	}, function (err, friends) {

		if (err) {
			res.json({error: err});
		} else {
			if (friends) {
				res.json(friends);
			} else {
				res.json({message: 'Wrong ID'});
			}
		}

	});
}

// Remove Friend
// RES JSON: friends / error
exports.removeUserFriend = function (req, res) {

	User.findByIdAndUpdate(req.params.id, {
		$pull: {
			friends: req.params.friend
		}
	}, {
		new: true,
		select: 'friends'
	}, function (err, friends) {

		if (err) {
			res.json(err);
		} else {
			if (friends) {
				res.json(friends);
			} else {
				res.json({message: 'Wrong ID'});
			}
		}

	});
}

// Get deck
// RES JSON: deck / error
exports.getUserDeck = function (req, res) {
	User.findById(req.params.id)
		.populate({
			path: 'deck',
			select: 'username motto truck attributes'
		})
		.exec(function (err, user) {
		if (err) {
			res.json({error: err});
		} else {
			if (user.deck.length == 20) {
				res.json(user.deck);
			} else {
				res.json({message: 'Wrong ID'});
			}
		}
		});
}


// Update deck
// REQ JSON: deck
// RES JSON: deck / error
exports.updateUserDeck = function (req, res) {

	User.findByIdAndUpdate(req.params.id, {
		deck: req.body
	}, {
		new: true,
		select: 'deck'
	}, function (err,  deck) {

		if (err) {
			res.json({error: err});
		} else {
			if (deck) {
				res.json(deck);
			} else {
				res.json({message: 'Wrong ID'});
			}
		}
	});
}