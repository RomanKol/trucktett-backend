var Game = require('../models/game');

// Get all Games
// RES JSON: [games]
exports.getGames = function (req, res) {

	Game.find({}, function (err, games) {
		res.json(games);
	});

}

// Remove all Games
// RES JSON: message
exports.removeGames = function (req, res) {

	Game.remove({}, function (err){
		res.json({message: 'Removed Games'});
	});

}

// Get Game by ID
// RES: Game / error
exports.getGame = function (req, res) {

	Game.findById(req.params.id, function (err, game) {

		if (err) {
			res.json({error: err});
		} else {
			if (game) {
				res.json(game);
			} else {
				res.json({error: 'Wrong ID'});
			}
		}

	});

}


// Get Open Games
exports.getOpenGame = function (req, res) {

	Game.findOne({ playersLength: {$lt: 2}}, function (err, game) {

		// Fehler
		if (err) {
			res.json({error: err});
		}
		// Found Game
		else {
			res.json(game);
		}
	});

}

exports.createGame = function (req, res) {

	newGame = Game();

	newGame.players.push(req.body);

	newGame.save(function (err, game) {
		if (err) {
			res.json({error: err});
		} else {
			res.json(game);
		}
	})
}


exports.updateOpenGame = function (req, res) {

	Game.findOneAndUpdate({ players: {$size: 1}},
		{$addToSet: {players: req.body}},
		{new: true, upsert: true},
		function (err, game) {

		// Fehler
		if (err) {
			res.json({error: err});
		}
		// Found Game
		else {
			res.json(game);
		}
	});
}


exports.createOrUpdateGame = function (req, res) {

	turn = req.body;
	turn.gameId = req.params.id;

	Game.findById(turn.gameId, function (err, game) {

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

		res.json({winnerId: game.players[winnerIndex]._id, playersDeckLengths: playersDeckLengths, round: game.round});
	});
}