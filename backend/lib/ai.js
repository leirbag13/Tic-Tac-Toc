'use strict';

/**
 * A simple AI for playing tic-tac-toe.
 *
 * Example usage:
 *
 *      var ai   = require('ai');
 *
 *          game = Game.create();
 *
 *      ai.makeMove(game);
 *
 */
module.exports = {
    makeMove: function (game) {
        var moves = game.availableMoves,
            aiMove;

        if (moves.length > 0) {
            aiMove  = moves[Math.floor(Math.random()*moves.length)];
            game.registerMove(game.currentPlayer, aiMove);
        }
    }
};
