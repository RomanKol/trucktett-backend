var User = require('../models/user'),
	salt = require('../../config.js').secret,
	jsonwebtoken = require('jsonwebtoken');

// POST
// REQ JSON: mail, password
// RES JSON: user / error
exports.login = function (req, res) {

	// Find User by mail
	User.findOne({'_mail': req.body.mail}, function (err, user) {

		// If no user was found, send error msg
		if (!user) {

			// Send error Response
			res.json({error: 'Authentication failed. Wrong Mail', login: false});

		} else if (user) {

			// Check password
			if (user.authenticate(req.body.password)) {

					// Genearte Token
					token = jsonwebtoken.sign({name: user.username, mail: user.mail}, salt, {expiresIn: 21000});

					// Delete password from object
					delete user._password;

				// Send Response
				res.json({token: token, user:user, login: true});

			// else send error msg
			} else {

				// Send Error Response
				res.json({error: 'Authentication failed. Wrong password.', login: false});

			}
		}
	});
}

exports.auth = function (req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if (token) {
		jsonwebtoken.verify(token, salt, function (err, decoded) {
			if (err) {
				return res.json({error: 'Authentication failed. Wrong token'});
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		return res.status(403).json({error: 'Authentication failed. No token provided'})
	}
}