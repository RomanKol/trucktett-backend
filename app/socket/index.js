module.exports = function(io) {

	var socketsCtrl = require('../controller/sockets');

	var users = {};

	io.on('connection', function (socket) {

		var user,
		gameId;

		// New Connection
		socket.emit(
			'status',
			'Hello from TruckTett');
		socket.broadcast.emit(
			'status',
			'A new user joined');

		socket.on('status', function (msg) {
			user = msg;
			users[msg] = socket;
		});

		// Chat
		socket.on('chat', function(msg) {
			io.emit('chat', msg);
		});

		// Game Queue
		socket.on('queue', function (userid) {

			socketsCtrl.enterOpenGame(
				userid,
				// callback
				function (game) {
					// Set gameid
					gameId = game._id;

					// Join new gameInstanceRoom
					socket.join(gameId);

					// Inform user wheter game is ready
					if (game.ready()) {
						io.sockets.in(gameId).emit(
							'queue',
							{
								ready: true,
								player: game.players[Math.floor(Math.random() * game.players.length)]._id,
								msg: 'Opponents found',
								gameId: gameId
							});

					// or not
					} else {
						io.sockets.in(gameId).emit(
							'queue',
							{
								ready: false,
								msg: 'Wait for opponents',
								gameId: gameId
							});
					}
			});
		});

		// Game Turn
		// turn = {attribute: String, gt: Boolean}
		// gt = greater then, true: >, false: <
		socket.on('game', function (turn) {
			turn.gameId = gameId;
			socketsCtrl.updateGame(
				turn,

				// Callback
				function (msg) {
					msg.choosenAttribute = turn.attribute;
					io.sockets.in(gameId).emit('game', msg);
				});
		});

		// User disconnection
		socket.on('disconnect', function () {
			console.log('User disconnected');
			socket.broadcast.emit('status', 'A User has left');
			delete users[user];
		});
	});

}