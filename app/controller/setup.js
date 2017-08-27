var fs = require('fs'),
	User = require('../models/user');

exports.initDb = function (req, res) {
	fs.readFile('./jsons/users.json', 'utf8', function (err, userdata) {
		var users = JSON.parse(userdata);

		for (var userobj of users) {

			var newUser = User(userobj);

			newUser.save(function (err, user) {
				if (err) {
					console.log(err);
				}
			});
		}
		res.json({message: 'Imported Users'});
	});
};

exports.clearDb = function (req, res) {
	User.remove({}, function (err){
		res.json({message: 'Users removed'});
	});
};