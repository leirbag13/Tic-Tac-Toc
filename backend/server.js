'use strict';

var express     = require('express'),
    bodyParser  = require('body-parser'),
    lib         = require('requirefrom')('lib'),

    ai          = lib('ai'),
    Game        = lib('game'),
    store       = lib('store'),
    tilesHelper = lib('game-tiles-helper'),

    app         = express();

module.exports = app;

function isInvalidInputError(e) {
    if (
        e instanceof Game.InvalidPlayerError ||
        e instanceof Game.InvalidPositionError ||
        e instanceof Game.IncorrectPlayerError
    ) {
        return true;
    }
    return false;
}

function isNotAllowedError(e) {
    if (
        e instanceof Game.GameOverError ||
        e instanceof Game.PositionUnavailableError
    ) {
        return true;
    }
    return false;
}

/**
 * Start new game
 */
app.post('/api/game', [
    function (req, res) {
        var game   = Game.create(),
            id     = store.set(game),
            tiles  = tilesHelper(game),
            result = {
                    id: id,
                    tiles: tiles
                };

        res.status(201).send(result);
    }
]);

/**
 * Fetch an existing game
 */
app.get('/api/game/:id', [
    function (req, res) {
        var game   = store.get(req.params.id),
            status = 200,
            result = null;

        if (game instanceof Game.Game) {
            result = {
                    id: req.params.id,
                    tiles: tilesHelper(game),
                    winner: game.winner
                };
        } else {
            status = 404;
        }

        res.status(status).send(result);
    }
]);

/**
 * Make a move on existing game
 */
app.post('/api/game/:id', [
    bodyParser.json(),
    function (req, res) {
        var game   = store.get(req.params.id),
            tileId = req.body.tileId,
            status = 200,
            result = null;

        if (game instanceof Game.Game) {
            game.registerMove('X', tileId);
            ai.makeMove(game);
            result = {
                id: req.params.id,
                tiles: tilesHelper(game),
                winner: game.winner
            };
        } else {
            status = 404;
        }

        res.status(status).send(result);
    }
]);

/**
 * Catch all error handler
 */
app.use(function (error, req, res, next) {
    var status = 500,
        result = {
            error: error.message
        };

    if (isInvalidInputError(error)) {
        status = 401;
    } else if (isNotAllowedError(error)) {
        status = 403;
    }

    res.status(status).send(result);
});

app.set('port', (process.env.PORT || 3001));
app.listen(app.get('port'), function () {
    console.log('Find the server at: http://localhost:' + app.get('port'));
});
