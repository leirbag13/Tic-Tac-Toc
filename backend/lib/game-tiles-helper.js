'use strict';

/**
 * Return a summary of the tiles from a game instance.
 *
 * Example usage:
 *
 *      var helper = require('game-tiles-helper');
 *
 *          game   = Game.create();
 *
 *      game.registerMove('X', 1);
 *      game.registerMove('O', 2);
 *      game.registerMove('X', 9);
 *      console.log(helper('game));
 *
 * The end result will look like:
 *
 *      [
 *          {id: 1, value: 'X'},
 *          {id: 2, value: 'O'},
 *          {id: 3},
 *          {id: 4},
 *          {id: 5},
 *          {id: 6},
 *          {id: 7},
 *          {id: 8},
 *          {id: 9, value: 'X'}
 *      ]
 */
module.exports = function (game) {
    var moves = game.occupiedMoves,
        tiles = [
                {id: 1},
                {id: 2},
                {id: 3},
                {id: 4},
                {id: 5},
                {id: 6},
                {id: 7},
                {id: 8},
                {id: 9}
            ];

    Object.keys(moves).forEach(function (key) {
        tiles[key-1].value = moves[key];
    });

    return tiles;
};
