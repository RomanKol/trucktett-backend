var User = require('../models/user'),
	Game = require('../models/game');

exports.getUserForGame = function (id, callback) {

	User.findById(id)
		.populate({
			path: 'deck',
			select: 'username motto truck attributes'
		})
		.select('username deck -_id')
		.exec(function (err, user) {
		if (err) {
			callback({error: err});
		} else {
			if (user.deck.length == 20) {
				console.log(user._id);
				callback(user);
			} else {
				callback({message: 'Wrong ID'});
			}
		}
	});
}

exports.enterOpenGame = function (id, callback) {

	User.findById(id)
		.populate({
			path: 'deck',
			select: 'username motto truck attributes'
		})
		.select('username deck')
		.exec(function (err, user) {
			if (err) {
				callback({error: err});
			} else {

				var tmpUser = {
					_id: user.id,
					username: user.username,
					deck: []
				}

				user.deck.forEach(function (card) {
					tmpUser.deck.push({
						_id: card._id,
						username: card.username,
						motto: card.motto,
						truck: card.truck,
						attributes: card.attributes
					});
				});

				Game.findOneAndUpdate({players: {$size: 1}},
					{$addToSet: {players: tmpUser}},
					{new: true, upsert: true},
					function (err, game) {
						// Fehler
						if (err) {
							callback({error: err});
						}
						// Found Game
						else {
							callback(game);
						}
				});
			}
	});
}

exports.updateGame = function (turn, callback) {

	Game.findById(turn.gameId, function (err, game) {

		if(err) {

			console.log(err);

		} else {

			var cards = [],
					playersDeckLengths = [],
					winnerIndex;

			// Get first Card from every player to compare
			game.players.forEach(function (player, index) {
				if(player.deck.length > 0) {
					cards.push({player: index, card: player.deck.shift()});
				}
			});

			// Sort Cards ascending
			cards.sort(function (a, b) {
				return a.card.attributes[turn.attribute] - b.card.attributes[turn.attribute];
			});

			// Get Winner
			if(turn.gt) {
				winnerIndex = cards[cards.length - 1].player;
			} else {
				winnerIndex = cards[0].player;
			}

			// Give Winner the Cards
			cards.forEach(function(card) {
				// Give Winner Cards
				game.players[winnerIndex].deck.push(card.card);
			});

			// Get New Deck Length
			game.players.forEach(function(player, index) {
				playersDeckLengths.push({
					_id: player._id,
					deckLengths: player.deck.length});
			})

			// Update Gamerounds
			game.round--;
			game.markModified('players');

			game.save(function (err) {
				if (err) {
					console.log(err);
				}
			});

			callback({player: game.players[winnerIndex]._id, playersDeckLengths: playersDeckLengths, round: game.round});
		}
	});
}