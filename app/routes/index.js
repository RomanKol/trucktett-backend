var setupCtrl = require('../controller/setup'),
	authCtrl = require('../controller/auth'),
	userCtrl = require('../controller/user'),
	gameCtrl = require('../controller/game');

module.exports = function (router, path) {

/**
 * @apiDefine Token
 * @apiHeader {String} x-access-token Users unique JSONWebToken
 */

 /**
 * @apiDefine UserObj
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "_id": "56c4e3c4a78144025b7e90f5",
 *       "lastUpdate": "2016-02-17T22:48:25.205Z",
 *       "username": "John Doe",
 *       "mail" : "mail@example.com",
 *       "motto": "Ein tolles Motto",
 *       "truck": "Name des Trucks",
 *       "loc": [
 *         48.2259,
 *         9.0723
 *       ],
 *       "deck": [
 *         "56c4e3c43240a5d6affea593",
 *         "56c4e3c4b63df58f839a30c7"
 *       ],
 *       "friends": [
 *         "56c4e3c43240a5d6affea593",
 *         "56c4e3c4b63df58f839a30c7"
 *       ],
 *       "about": {
 *         "coffee": 21,
 *         "dish": "Strammer Max",
 *         "station": "Autohof Gramschatzer Wald A7",
 *         "route": "HŽlŽcine (BE) - Pamplona (ES)"
 *       },
 *       "attributes": {
 *         "tank": 77,
 *         "v": 74.94,
 *         "eco": 9,
 *         "weight": 35.3,
 *         "games": 40,
 *         "ranking": 4118,
 *         "jam": 9,
 *         "km": 946
 *       },
 *       "__v": 0
 *     }
 */

 /**
 * @apiDefine WrongID
 * @apiErrorExample {json} Error-Response:
 *     {
 *       error: 'Wrong ID'
 *     }
 */

 /**
 * @apiDefine Error
 * @apiErrorExample {json} Error-Response:
 *     {
 *       error: {MongooseErrorObject}
 *     }
 */

 /**
 * @apiDefine UserArray
 * @apiSuccessExample {json} Success-Response:
 *     [
 *       {userobject1},
 *       {userobject2}
 *     ]
 */

	// Open Access

	// Initializing DB with User Data
	router.route('/setup')
/**
 * @api {post} /trucktett/setup Add 64 dummy users to the database
 * @apiName InitDatabase
 * @apiGroup Dev
 *
 * @apiSuccess {Object} message Message
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       message: 'Imported Users'
 *     }
 */
		.post(setupCtrl.initDb)
/**
 * @api {delete} /trucktett/setup Delete all users
 * @apiName ClearDatabase
 * @apiGroup Dev
 *
 * @apiSuccess {Object} message Message
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       message: 'Users removed'
 *     }
 */
		.delete(setupCtrl.clearDb);


	router.route('/users')
/**
 * @api {post} /trucktett/users/ Add new user
 * @apiName CreateUser
 * @apiGroup Users
 *
 * @apiParam {Object} user Userdata
 * @apiParam {String} user.mail User mail
 * @apiParam {String} user.password User password
 * @apiParam {String} user.username Username
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "mail": "mail@example.com",
 *       "passowrd": "superSafePassword",
 *       "username": "John Doe"
 *     }
 *
 * @apiSuccess {Object} userdata Updated Object with Userdata
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "_id": "56c4e3c4a78144025b7e90f5",
 *       "lastUpdate": "2016-02-17T22:48:25.205Z",
 *       "username": "John Doe",
 *       "mail" : "mail@example.com",
 *       "motto": "",
 *       "truck": "",
 *       "loc": Number[2],
 *       "deck": String[],
 *       "friends": String[],
 *       "about": {
 *         "coffee": 0,
 *         "dish": "",
 *         "station": "",
 *         "route": ""
 *       },
 *       "attributes": {
 *         "tank": 0,
 *         "v": 0,
 *         "eco": 0,
 *         "weight": 0,
 *         "games": 0,
 *         "ranking": 0,
 *         "jam": 0,
 *         "km": 0
 *       },
 *       "__v": 0
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "error": {ErrorObject}
 *     }
 */
		.post(userCtrl.createUser);

/**
 * @api {post} /trucktett/login Login with userdata
 * @apiName Login
 * @apiGroup Login
 *
 * @apiParam {Object} login Login data
 * @apiParam {String} login.mail User mail address
 * @apiParam {String} login.password User password
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "mail": "mail@example.com",
 *       "passowrd": "superSafePassword"
 *     }
 *
 * @apiSuccess {Object} login Logindata
 * @apiSuccess {Boolean} login.login Wheter the login was successfull or not
 * @apiSuccess {String} login.token JSONWebToken for Authentification
 * @apiSuccess {Object} login.user Userobject
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "token": "JSONWebToken",
 *       "login": true
 *       "user": {Userobject}
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "login": false
 *       "error": "Error Message"
 *     }
 */
	router.route('/login')
		.post(authCtrl.login);

	// User Authentication
	router.use(authCtrl.auth);

	// Restricted Access
	// Authentication needed
/**
 * @api {get} /trucktett/users Get all users
 * @apiName GetUsers
 * @apiGroup Users
 *
 * @apiUse Token
 *
 * @apiSuccess {Object[]} users Array with Userobjects
 *
 * @apiUse UserArray
 */
	router.route('/users')
		.get(userCtrl.getUsers);

/**
 * @api {get} /trucktett/users/nearby Get all users in area
 * @apiName GetUsersNearby
 * @apiGroup Users
 *
 * @apiUse Token
 *
 * @apiHeader {Number} lat Latitude position.
 * @apiHeader {Number} lng Longitude position.
 * @apiHeader {Number} distance Distance around position.
 *
 * @apiSuccess {Object[]} user Users
 * @apiSuccess {String} user._id Userid
 * @apiSuccess {String} user.username Username
 * @apiSuccess {String} user.motto Usermotto
 * @apiSuccess {String} user.truck Usertruck
 * @apiSuccess {Number[2]} user.location Locationdatay
 *
 *     [
 *       {
 *         "_id": "56c4e3c43240a5d6affea593",
 *         "username": "Winters Collier",
 *         "motto": "A motto",
 *         "truck": "Silberpfeil",
 *         "loc": [
 *           48.5381,
 *           9.5387
 *         ]
 *       }, ...
 *     ]
 */
	router.route('/users/nearby')
		.get(userCtrl.getUsersNearby);


	// User
	// ToDo need further restricted access
	// Only Admin and user itself should be allowed to access
	router.route('/users/:id')
/**
 * @api {get} /trucktett/users/:userID Get user
 * @apiName GetUser
 * @apiGroup Users
 *
 * @apiUse Token
 *
 * @apiSuccess {Object} user User
 * @apiSuccess {String} user._id Userid
 * @apiSuccess {String} user.username Username
 * @apiSuccess {String} user.motto Usermotto
 * @apiSuccess {String} user.truck Usertruck
 * @apiSuccess {String[]} user.deck Userdeck
 * @apiSuccess {String[]} user.friends Userfriends
 * @apiSuccess {Object} user.about Userabouts
 * @apiSuccess {Number} user.about.coffee Usercoffee
 * @apiSuccess {String} user.about.dish Userdish
 * @apiSuccess {String} user.about.station Userstation
 * @apiSuccess {String} user.about.route Userroute
 * @apiSuccess {Object} user.attributes Userfriends
 * @apiSuccess {Number} user.attributes.tank Usertank
 * @apiSuccess {Number} user.attributes.v Userv
 * @apiSuccess {Number} user.attributes.eco Usereco
 * @apiSuccess {Number} user.attributes.weight Userweight
 * @apiSuccess {Number} user.attributes.games Usergames
 * @apiSuccess {Number} user.attributes.ranking Userranking
 * @apiSuccess {Number} user.attributes.jam Userjam
 * @apiSuccess {Number} user.attributes.km Userkm
 *
 * @apiUse UserObj
 * @apiUse WrongID
 * @apiUse Error
 */
		.get(userCtrl.getUser)
/**
 * @api {put} /trucktett/users/:userID Update user
 * @apiName UpdateUser
 * @apiGroup Users
 *
 * @apiUse Token
 *
 * @apiParam {Object} userdata Userobject with Updates for password, mail or username
 * @apiParamExample {json} Request-Example:
 *     {
 *       "mail": "mail@example.com",
 *       "passowrd": "superSafePassword",
 *       "username": "John Doe"
 *     }
 *
 * @apiSuccess {Object} userdata Updated Object with Userdata
 * @apiUse UserObj
 * @apiUse WrongID
 * @apiUse Error
 */
		.put(userCtrl.updateUser)
/**
 * @api {delete} /trucktett/users/:userID Delete user
 * @apiName DeleteUser
 * @apiGroup Users
 *
 * @apiUse Token
 *
 * @apiSuccess {String} message Delete User
 * @apiSuccessExample {json} Success-Response:
 *     {
 *     	 {message: 'Removed User'}
 *     }
 * @apiUse WrongID
 * @apiUse Error
 */
		.delete(userCtrl.deleteUser);

	// User Profile
	router.route('/users/:id/profile')
/**
 * @api {get} /trucktett/users/:userID/profile Get user profile
 * @apiName GetUserProfile
 * @apiGroup Users
 *
 * @apiUse Token
 *
 * @apiSuccess {Object} user User
 * @apiSuccess {String} user._id Userid
 * @apiSuccess {String} user.username Username
 * @apiSuccess {String} user.motto Usermotto
 * @apiSuccess {String} user.truck Usertruck
 * @apiSuccess {Object} user.about Userabouts
 * @apiSuccess {Number} user.about.coffee Usercoffee
 * @apiSuccess {String} user.about.dish Userdish
 * @apiSuccess {String} user.about.station Userstation
 * @apiSuccess {String} user.about.route Userroute
 * @apiSuccess {Object} user.attributes Userfriends
 * @apiSuccess {Number} user.attributes.tank Usertank
 * @apiSuccess {Number} user.attributes.v Userv
 * @apiSuccess {Number} user.attributes.eco Usereco
 * @apiSuccess {Number} user.attributes.weight Userweight
 * @apiSuccess {Number} user.attributes.games Usergames
 * @apiSuccess {Number} user.attributes.ranking Userranking
 * @apiSuccess {Number} user.attributes.jam Userjam
 * @apiSuccess {Number} user.attributes.km Userkm
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "_id": "56c4e3c4a78144025b7e90f5",
 *       "username": "John Doe",
 *       "motto": "Ein Motto",
 *       "truck": "Truck Name",
 *       "about": {
 *         "coffee": 21,
 *         "dish": "Strammer Max",
 *         "station": "Autohof Gramschatzer Wald A7",
 *         "route": "HŽlŽcine (BE) - Pamplona (ES)"
 *       },
 *       "attributes": {
 *         "tank": 77,
 *         "v": 74.94,
 *         "eco": 9,
 *         "weight": 35.3,
 *         "games": 40,
 *         "ranking": 4118,
 *         "jam": 9,
 *         "km": 946
 *       }
 *     }
 *
 * @apiUse WrongID
 * @apiUse Error
 */
		.get(userCtrl.getUserProfile)
/**
 * @api {put} /trucktett/users/:userID/profile Update user profile
 * @apiName UpdateUserProfile
 * @apiGroup Users
 *
 * @apiUse Token
 *
 * @apiParam {String} username Username
 * @apiParam {String} motto Usermotto
 * @apiParam {String} truck Usertruck
 * @apiParam {Object} about Userabouts
 * @apiParam {Number} about.coffee Usercoffee
 * @apiParam {String} about.dish Userdish
 * @apiParam {String} about.station Userstation
 * @apiParam {String} about.route Userroute
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "username": "John Doe No 2",
 *       "truck": "Neuer Truck Name",
 *       "motto": "Neues Motto",
 *       "about": {
 *         "coffee": 21,
 *         "dish": "Strammer Max",
 *         "station": "Autohof Gramschatzer Wald A7",
 *         "route": "HŽlŽcine (BE) - Pamplona (ES)"
 *       }
 *     }
 *
 * @apiSuccess {Object} user User
 * @apiSuccess {String} user._id Userid
 * @apiSuccess {String} user.username Username
 * @apiSuccess {String} user.motto Usermotto
 * @apiSuccess {String} user.truck Usertruck
 * @apiSuccess {Object} user.about Userabouts
 * @apiSuccess {Number} user.about.coffee Usercoffee
 * @apiSuccess {String} user.about.dish Userdish
 * @apiSuccess {String} user.about.station Userstation
 * @apiSuccess {String} user.about.route Userroute
 * @apiSuccess {Object} user.attributes Userfriends
 * @apiSuccess {Number} user.attributes.tank Usertank
 * @apiSuccess {Number} user.attributes.v Userv
 * @apiSuccess {Number} user.attributes.eco Usereco
 * @apiSuccess {Number} user.attributes.weight Userweight
 * @apiSuccess {Number} user.attributes.games Usergames
 * @apiSuccess {Number} user.attributes.ranking Userranking
 * @apiSuccess {Number} user.attributes.jam Userjam
 * @apiSuccess {Number} user.attributes.km Userkm
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "_id": "56c4e3c4a78144025b7e90f5",
 *       "username": "John Doe No 2",
 *       "motto": "Neues Motto",
 *       "truck": "Neuer Truck Name",
 *       "about": {
 *         "coffee": 21,
 *         "dish": "Strammer Max",
 *         "station": "Autohof Gramschatzer Wald A7",
 *         "route": "HŽlŽcine (BE) - Pamplona (ES)"
 *       },
 *       "attributes": {
 *         "tank": 77,
 *         "v": 74.94,
 *         "eco": 9,
 *         "weight": 35.3,
 *         "games": 40,
 *         "ranking": 4118,
 *         "jam": 9,
 *         "km": 946
 *       }
 *     }
 *
 * @apiUse WrongID
 * @apiUse Error
 */
		// ToDo need further restricted access
		// Only Admin and user itself should be allowed to access
		.put(userCtrl.updateUserProfile);

	// User About
	router.route('/users/:id/attributes')
	/**
 * @api {put} /trucktett/users/:userID/attributes Update user attributes
 * @apiName UpdateUserCardAttributes
 * @apiGroup Users
 *
 * @apiUse Token
 *
 * @apiParam {Number} tank Usertank
 * @apiParam {Number} v Userv
 * @apiParam {Number} eco Usereco
 * @apiParam {Number} weight Userweight
 * @apiParam {Number} games Usergames
 * @apiParam {Number} ranking Userranking
 * @apiParam {Number} jam Userjam
 * @apiParam {Number} km Userkm
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "tank": 77,
 *       "v": 74.94,
 *       "eco": 9,
 *       "weight": 35.3,
 *       "games": 40,
 *       "ranking": 4118,
 *       "jam": 9,
 *       "km": 946
 *     }
 *
 * @apiSuccess {Number} tank Usertank
 * @apiSuccess {Number} v Userv
 * @apiSuccess {Number} eco Usereco
 * @apiSuccess {Number} weight Userweight
 * @apiSuccess {Number} games Usergames
 * @apiSuccess {Number} ranking Userranking
 * @apiSuccess {Number} jam Userjam
 * @apiSuccess {Number} km Userkm
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "tank": 77,
 *       "v": 74.94,
 *       "eco": 9,
 *       "weight": 35.3,
 *       "games": 40,
 *       "ranking": 4118,
 *       "jam": 9,
 *       "km": 946
 *     }
 *
 * @apiUse WrongID
 * @apiUse Error
 */
		.put(userCtrl.updateUserAttributes);

	// User Card
	router.route('/users/:id/card')
/**
 * @api {get} /trucktett/users/:userID/card Get user card
 * @apiName GetUserCard
 * @apiGroup Users
 *
 * @apiUse Token
 *
 * @apiSuccess {Object} user User
 * @apiSuccess {String} user._id Userid
 * @apiSuccess {String} user.username Username
 * @apiSuccess {String} user.motto Usermotto
 * @apiSuccess {String} user.truck Usertruck
 * @apiSuccess {Object} user.attributes Userfriends
 * @apiSuccess {Number} user.attributes.tank Usertank
 * @apiSuccess {Number} user.attributes.v Userv
 * @apiSuccess {Number} user.attributes.eco Usereco
 * @apiSuccess {Number} user.attributes.weight Userweight
 * @apiSuccess {Number} user.attributes.games Usergames
 * @apiSuccess {Number} user.attributes.ranking Userranking
 * @apiSuccess {Number} user.attributes.jam Userjam
 * @apiSuccess {Number} user.attributes.km Userkm
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "_id": "56c4e3c4a78144025b7e90f5",
 *       "username": "John Doe",
 *       "attributes": {
 *         "tank": 77,
 *         "v": 74.94,
 *         "eco": 9,
 *         "weight": 35.3,
 *         "games": 40,
 *         "ranking": 4118,
 *         "jam": 9,
 *         "km": 946
 *       },
 *       "motto": "Ein Motto",
 *       "truck": "Truck Name"
 *     }
 *
 * @apiUse WrongID
 * @apiUse Error
 */
		.get(userCtrl.getUserCard);

	// User Image
	router.route('/users/:id/image')
/**
 * @api {get} /trucktett/users/:userID/image Get user image
 * @apiName GetUserImage
 * @apiGroup Users
 *
 * @apiUse Token
 *
 * @apiSuccess {file} image User image
 *
 * @apiUse WrongID
 * @apiUse Error
 */
		.get(userCtrl.getUserImage)
/**
 * @api {put} /trucktett/users/:userID/image Update user image
 * @apiName UpdateUserImage
 * @apiGroup Users
 * @apiDescription Not Implemented
 *
 * @apiUse Token
 */
		.put(userCtrl.updateUserImage);

	// Location
	router.route('/users/:id/loc')
/**
 * @api {put} /trucktett/users/:userID/loc Update user location data
 * @apiName UpdateUserLocationData
 * @apiGroup Users
 *
 * @apiUse Token
 *
 * @apiParam {Number[2]} location User Location
 * @apiParamExample {json} Request-Example:
 *     [
 *       45.4094586,
 *       9.40950680
 *     ]
 *
 * @apiSuccess {Number[2]} location Updated User Location
 * @apiSuccessExample {file} Success-Response:
 *     [
 *       45.4094586,
 *       9.40950680
 *     ]
 * @apiUse WrongID
 * @apiUse Error
 */
		.put(userCtrl.updateUserLoc);

	// Friendlist
	router.route('/users/:id/friends')
/**
 * @api {get} /trucktett/users/:userID/friends Get user friendlist
 * @apiName GetUserFriendliste
 * @apiGroup Users
 *
 * @apiUse Token
 *
 * @apiSuccess {Object[]} friends Array with Userobjects containing id, username and the motto of users
 * @apiSuccessExample {json} Success-Response:
 *     [
 *       {
 *         "_id": "56c4e3c4a78144025b7e90f5",
 *         "username": "John Doe No 1",
 *         "motto": "Ein Motto",
 *       }, ...
 *     ]
 *
 * @apiUse WrongID
 * @apiUse Error
 */
		.get(userCtrl.getUserFriends)
/**
 * @api {delete} /trucktett/users/:userID/friends Delete friendlist
 * @apiName DeleteUserFriendlist
 * @apiGroup Users
 *
 * @apiUse Token
 *
 * @apiSuccess {[0]} friends Empty Array
 * @apiSuccessExample {json} Success-Response:
 *     [
 *     ]
 *
 * @apiUse WrongID
 * @apiUse Error
 */
		.delete(userCtrl.removeUserFriends);

	// Friends in Friendlist
	router.route('/users/:id/friends/:friend')
/**
 * @api {put} /trucktett/users/:userID/friends/:friendID Add user to friendlist
 * @apiName AddFriend
 * @apiGroup Users
 *
 * @apiUse Token
 *
 * @apiSuccess {String[]} friends Updated Array with Userids
 * @apiSuccessExample {json} Success-Response:
 *     [
 *       '56c4e3c4966557b1e743d7a8',
 *       '56c4e3c45655e63e48632fc7',
 *       ...
 *     ]
 *
 * @apiUse WrongID
 * @apiUse Error
 */
		.put(userCtrl.addUserFriend)
/**
 * @api {delete} /trucktett/users/:userID/friends/:friendID Delete user from user friendlist
 * @apiName DeleteFriend
 * @apiGroup Users
 *
 * @apiUse Token
 *
 * @apiSuccess {String} friends Updated Array with Userobjects
 * @apiSuccessExample {json} Success-Response:
 *     [
 *       '56c4e3c4966557b1e743d7a8',
 *       '56c4e3c45655e63e48632fc7',
 *       ...
 *     ]
 *
 * @apiUse WrongID
 * @apiUse Error
 */
		.delete(userCtrl.removeUserFriend);

	// User Cardstack
	router.route('/users/:id/deck')
	/**
 * @api {get} /trucktett/users/:userID/deck Get user deck
 * @apiName GetUserDeck
 * @apiGroup Users
 *
 * @apiUse Token
 *
 * @apiSuccess {Object[20]} friends Array with 20 Userobjects containing id, username and the motto of users
 * @apiSuccessExample {json} Success-Response:
 *     [
 *       {
 *         "_id": "56c4e3c4966557b1e743d7a8",
 *         "username": "John Doe No 1",
 *         "attributes": {
 *           "tank": 89,
 *           "v": 67.67,
 *           "eco": 50,
 *           "weight": 20.75,
 *           "games": 53,
 *           "ranking": 5373,
 *           "jam": 23,
 *           "km": 2609
 *         },
 *         "motto": "Ein Motto",
 *         "truck": "Ein Truck Name"
 *       }, ...
 *     ]
 *
 * @apiUse WrongID
 * @apiUse Error
 */
		.get(userCtrl.getUserDeck)
/**
 * @api {put} /trucktett/users/:userID/deck Update user deck
 * @apiName UpdateUserDeck
 * @apiGroup Users
 *
 * @apiUse Token
 *
 * @apiParam {String[20]} location User ID
 * @apiParamExample {json} Request-Example:
 *     [
 *       '56c4e3c4966557b1e743d7a8',
 *       '56c4e3c45655e63e48632fc7',
 *       ...
 *     ]
 *
 * @apiSuccess {String[20]} friends Updated Array with 20 Userobjects containing id, username and the motto of users
 * @apiSuccessExample {json} Success-Response:
 *     [
 *       '56c4e3c4966557b1e743d7a8',
 *       '56c4e3c45655e63e48632fc7',
 *       ...
 *     ]
 *
 * @apiUse WrongID
 * @apiUse Error
 */
		.put(userCtrl.updateUserDeck);

	// Games
	router.route('/games')
/**
 * @api {get} /trucktett/games Get all games
 * @apiName GetGames
 * @apiGroup Dev
 *
 * @apiUse Token
 *
 * @apiSuccess {Object[]} users Array with Game objects
 *
 * @apiUse UserArray
 */
		.get(gameCtrl.getGames)
/**
 * @api {post} /trucktett/games Create all games
 * @apiName CreateGames
 * @apiGroup Dev
 *
 * @apiUse Token
 *
 * @apiParam {Object} user User Object
 * @apiParam {String} user.id User id
 * @apiParam {String} user.name User name
 * @apiParam {object[20]} user.deck User deck
 *
 * @apiParamExample {json} Request-Example: *
 *     {
 *       "id": "56c4e3c4966557b1e743d7a8"
 *       "mail": "mail@example.com",
 *       "username": "John Doe",
 *       "deck": [
 *       	 {
 *           "_id": "56c4e3c4a78144025b7e90f5",
 *           "username": "John Doe",
 *           "attributes": {
 *             "tank": 77,
 *             "v": 74.94,
 *             "eco": 9,
 *             "weight": 35.3,
 *             "games": 40,
 *             "ranking": 4118,
 *             "jam": 9,
 *             "km": 946
 *           },
 *           "motto": "Ein Motto",
 *           "truck": "Truck Name"
 *         }, ...
 *       ]
 *     }
 *
 *
 * @apiSuccess {Object} game Game Object
 *
 * @apiUse UserArray
 */
		.post(gameCtrl.createGame)
/**
 * @api {delete} /trucktett/games Delete all games
 * @apiName DeleteGames
 * @apiGroup Dev
 *
 * @apiUse Token
 *
 * @apiSuccess {[]} games Empty Array
 *
 * @apiUse UserArray
 */
		.delete(gameCtrl.removeGames);

	router.route('/games/open')
/**
 * @api {get} /trucktett/games/open Get open games
 * @apiName GetOpenGame
 * @apiGroup Dev
 *
 * @apiUse Token
 *
 * @apiSuccess {Object} game Object with Players and their decks
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "_id": "56c8bb0a3c601e6dfb1022c1",
 *       "__v": 0,
 *       "round": 10,
 *       "players": [
 *         {
 *           "_id": "56c4e3c4a78144025b7e90f5",
 *           "username": "Monica Grimes",
 *           "deck": [
 *             {
 *               "_id": "56c4e3c45655e63e48632fc7",
 *               "username": "Medina Young",
 *               "motto": "Immer auf der A3 unterwegs.",
 *               "truck": "Vierbeiner",
 *               "attributes": {
 *                 "tank": 53,
 *                 "v": 73.65,
 *                 "eco": 33,
 *                 "weight": 22.69,
 *                 "games": 63,
 *                 "ranking": 3529,
 *                 "jam": 1,
 *                 "km": 4350
 *               }
 *             }, ...
 *           ]
 *         }, ...
 *       ]
 *     }
 *
 * @apiUse UserArray
 */
		.get(gameCtrl.getOpenGame)
/**
 * @api {get} /trucktett/games/open Update open game
 * @apiName UpdateOpenGame
 * @apiGroup Dev
 *
 * @apiUse Token
 *
 * @apiSuccess {Object} game Object with Players and their decks
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "_id": "56c8bb0a3c601e6dfb1022c1",
 *       "__v": 0,
 *       "round": 10,
 *       "players": [
 *         {
 *           "_id": "56c4e3c4a78144025b7e90f5",
 *           "username": "Monica Grimes",
 *           "deck": [
 *             {
 *               "_id": "56c4e3c45655e63e48632fc7",
 *               "username": "Medina Young",
 *               "motto": "Immer auf der A3 unterwegs.",
 *               "truck": "Vierbeiner",
 *               "attributes": {
 *                 "tank": 53,
 *                 "v": 73.65,
 *                 "eco": 33,
 *                 "weight": 22.69,
 *                 "games": 63,
 *                 "ranking": 3529,
 *                 "jam": 1,
 *                 "km": 4350
 *               }
 *             }, ...
 *           ]
 *         }, ...
 *       ]
 *     }
 *
 * @apiUse UserArray
 */
		.put(gameCtrl.updateOpenGame)

	// Game
	router.route('/games/:id')
/**
 * @api {get} /trucktett/games/:gameID Get game
 * @apiName GetGame
 * @apiGroup Dev
 *
 * @apiUse Token
 *
 * @apiSuccess {Object} game Object with Players and their decks
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "_id": "56c8bb0a3c601e6dfb1022c1",
 *       "__v": 0,
 *       "round": 10,
 *       "players": [
 *         {
 *           "_id": "56c4e3c4a78144025b7e90f5",
 *           "username": "Monica Grimes",
 *           "deck": [
 *             {
 *               "_id": "56c4e3c45655e63e48632fc7",
 *               "username": "Medina Young",
 *               "motto": "Immer auf der A3 unterwegs.",
 *               "truck": "Vierbeiner",
 *               "attributes": {
 *                 "tank": 53,
 *                 "v": 73.65,
 *                 "eco": 33,
 *                 "weight": 22.69,
 *                 "games": 63,
 *                 "ranking": 3529,
 *                 "jam": 1,
 *                 "km": 4350
 *               }
 *             }, ...
 *           ]
 *         }, ...
 *       ]
 *     }
 *
 * @apiUse UserArray
 */
		.get(gameCtrl.getGame)
/**
 * @api {put} /trucktett/games/:gameID Update or create game
 * @apiName UpdateOrCreateAGame
 * @apiGroup Dev
 *
 * @apiUse Token
 *
 * @apiParam {Object} Userobject with populated decklist
 * @apiParamExample {json} Request-Example:
 *     {
 *       "_id": "56c4e3c4a78144025b7e90f5",
 *       "username": "Monica Grimes",
 *       "deck": [
 *         {
 *           "_id": "56c4e3c45655e63e48632fc7",
 *           "username": "Medina Young",
 *           "motto": "Immer auf der A3 unterwegs.",
 *           "truck": "Vierbeiner",
 *           "attributes": {
 *             "tank": 53,
 *             "v": 73.65,
 *             "eco": 33,
 *             "weight": 22.69,
 *             "games": 63,
 *             "ranking": 3529,
 *             "jam": 1,
 *             "km": 4350
 *           }
 *         }, ...
 *       ]
 *     }
 *
 * @apiSuccess {Object} game Object with Players and their decks
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "_id": "56c8bb0a3c601e6dfb1022c1",
 *       "__v": 0,
 *       "round": 10,
 *       "players": [
 *         {
 *           "_id": "56c4e3c4a78144025b7e90f5",
 *           "username": "Monica Grimes",
 *           "deck": [
 *             {
 *               "_id": "56c4e3c45655e63e48632fc7",
 *               "username": "Medina Young",
 *               "motto": "Immer auf der A3 unterwegs.",
 *               "truck": "Vierbeiner",
 *               "attributes": {
 *                 "tank": 53,
 *                 "v": 73.65,
 *                 "eco": 33,
 *                 "weight": 22.69,
 *                 "games": 63,
 *                 "ranking": 3529,
 *                 "jam": 1,
 *                 "km": 4350
 *               }
 *             }, ...
 *           ]
 *         }, ...
 *       ]
 *     }
 *
 * @apiUse UserArray
 */
		.put(gameCtrl.createOrUpdateGame);

}
