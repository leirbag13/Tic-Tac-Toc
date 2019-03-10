'use strict';

/**
 * A simple enforcer of the rules of tic-tac-toe. Currently X starts every game.
 *
 * Example usage:
 *
 *      var game = require('game').create();
 *
 *      game.registerMove('X', 1)
 *          .registerMove('0', 9)
 *          .registerMove('X', 2);
 *
 *      console.log('Next players turn:', game.currentPlayer);
 */

var makeError = require('make-error'),

    // custom errors
    GameOverError            = makeError('GameOverError'),
    InvalidPlayerError       = makeError('InvalidPlayerError'),
    InvalidPositionError     = makeError('InvalidPositionError'),
    IncorrectPlayerError     = makeError('IncorrectPlayerError'),
    PositionUnavailableError = makeError('PositionUnavailableError'),

    // private functions
    Game = function () {
        throw new Error('You need to use create()');
    },

    /**
     * Determine whose turn it is from an object listing each players moves.
     * This currently assumes that player X has always started the game.
     *
     * @param      {object}  gameState  An object with two keys (X and O) where
     *                                  the value of each is the current moves
     *                                  that player has already made.
     * @return     {string}  The current player whose turn it is.
     */
    getCurrentPlayerFromGameState = function (gameState) {
        if (gameState.X.length > gameState.O.length) {
            return 'O';
        }

        return 'X';
    },

    /**
     * Gets the list of all empty positions still available based on an object
     * listing each players moves already taken. NOTE: No consideration is made
     * that a player might have won the game.
     *
     * @param      {object}  gameState  An object with two keys (X and O) where
     *                                  the value of each is the current moves
     *                                  that player has already made.
     * @return     {Array}   The list of empty positions.
     */
    getEmptyPositionsFromGameState = function (gameState) {
        var unavailableMoves = gameState.X.concat(gameState.O);

        return [1,2,3,4,5,6,7,8,9].filter(
            function (i) {
                return this.indexOf(i) < 0;
            },
            unavailableMoves
        );
    },

    /**
     * Gets the occupied positions from game state.
     *
     * @param      {object}  gameState  An object with two keys (X and O) where
     *                                  the value of each is the current moves
     *                                  that player has already made.
     * @return     {object}  The occupied positions.
     */
    getOccupiedPositionsFromGameState = function (gameState) {
        var result = {};

        [1,2,3,4,5,6,7,8,9].forEach(
            function (i) {
                if (gameState.X.indexOf(i) !== -1) {
                    result[i] = 'X';
                }
                if (gameState.O.indexOf(i) !== -1) {
                    result[i] = 'O';
                }
            }
        );

        return result;
    },

    /**
     * { function_description }
     *
     * @param      {object}  gameState  An object with two keys (X and O) where
     *                                  the value of each is the current moves
     *                                  that player has already made.
     * @param      {string}  player     The player making the move.
     * @param      {number}  position   The position to be made
     * @return     {object}             The modified gameState object.
     */
    updateGameState = function (gameState, player, position) {
        var validPlayer    = getCurrentPlayerFromGameState(gameState),
            emptyPositions = getEmptyPositionsFromGameState(gameState);

        if (['X', 'O'].indexOf(player) === -1) {
            throw new InvalidPlayerError('Only players X and O are permitted');
        }

        if (player !== validPlayer) {
            throw new IncorrectPlayerError('The current available turn is for player: ' + validPlayer);
        }

        if (position < 1 || position > 9) {
            throw new InvalidPositionError('Only positions between 1 and 9 are valid');
        }

        if (emptyPositions.indexOf(position) === -1) {
            throw new PositionUnavailableError(
                'The position is unavailable, available positions are: ' +
                emptyPositions.join(', ')
            );
        }

        gameState[player].push(position);

        return gameState;
    },

    /**
     * Determine if there is a winner based on an object listing each players
     * moves.
     *
     * @param      {object}  gameState  An object with two keys (X and O) where
     *                                  the value of each is the current moves
     *                                  that player has already made.
     * @return     {string}  The winner or null.
     */
    getWinnerFromGameState = function (gameState) {
        var winner = null,
            winningPositions = [
                [1, 2, 3], // across top row
                [4, 5, 6], // across middle row
                [7, 8, 9], // across bottom row
                [1, 4, 7], // down left column
                [2, 5, 8], // down middle column
                [3, 6, 9], // down right column
                [1, 5, 9], // backslash \ diagonal
                [3, 5, 7]  // forward-slash / diagonal
            ],
            hasWin = function (moves, win) {
                if (
                    moves.indexOf(win[0]) >= 0 &&
                    moves.indexOf(win[1]) >= 0 &&
                    moves.indexOf(win[2]) >= 0
                ) {
                    return true;
                }
                return false;
            };

        winningPositions.every(function (win) {
            if (hasWin(gameState.X, win)) {
                winner = 'X';
                return false;
            }
            if (hasWin(gameState.O, win)) {
                winner = 'O'
                return false;
            }
            return true
        });

        return winner;
    },

    /**
     * The main constructor for this module
     *
     * @return     {Game}  Object representing the current state of the game.
     */
    create = function () {
        var status        = 'ongoing',
            winner        = null,
            gameState     = {
                X: [],
                O: []
            },
            currentPlayer  = 'X',
            availableMoves = getEmptyPositionsFromGameState(gameState);

        return Object.create(Game.prototype, {
                /**
                 * Valid values are:
                 *  - ongoing: Another move can be made
                 *  - over: The game has come to a conclusion and no more moves
                 *          can be made.
                 */
                status: {
                    get: function () {
                        return status;
                    }
                },
                /**
                 * Which positions on the board are still available. The board
                 * is numbered as so:
                 *   1 | 2 | 3
                 *   4 | 5 | 6
                 *   7 | 8 | 9
                 */
                availableMoves: {
                    get: function () {
                        return availableMoves;
                    }
                },
                /**
                 * Which positions are occupied including which player
                 */
                occupiedMoves: {
                    get: function () {
                        return getOccupiedPositionsFromGameState(gameState);
                    }
                },
                /**
                 * Whose turn it is, will either be X or O.
                 */
                currentPlayer: {
                    get: function () {
                        return currentPlayer;
                    }
                },
                /**
                 * Who has won the game, will either one of the players, or if
                 * the game is still ongoing or it is a draw then null.
                 */
                winner: {
                    get: function () {
                        return winner;
                    }
                },

                /**
                 * Attempt to apply one players move on the board, and if the move is valid then
                 * return itself (to allow chaining). Should the requested move be invalid for any
                 * reason then a Error will be thrown.
                 *
                 * @param      {string}  player    The player attempting to make the move.
                 * @param      {integer} position  A location on the board (1-9)
                 * @return     {Game}    Returns the Game instance
                 */
                registerMove: {
                    writable: true,
                    value: function (player, position) {
                        var emptyPositions;

                        if (availableMoves.length === 0) {
                            throw new GameOverError('The game is already over');
                        }

                        // Attempt to apply the move, any invalid moved will trigger
                        // an error here.
                        updateGameState(gameState, player, position);

                        // Check if the game is over
                        winner = getWinnerFromGameState(gameState);
                        emptyPositions = getEmptyPositionsFromGameState(gameState);

                        if (winner === null && emptyPositions.length > 0) {
                            // game still in progress
                            availableMoves = emptyPositions;
                            currentPlayer  = getCurrentPlayerFromGameState(gameState);

                        } else {
                            // game over
                            availableMoves = [];
                            currentPlayer  = null;
                            status         = 'over';
                        }

                        return this;
                    }
                }
            });
    };

module.exports = {
    create: create,
    Game: Game,
    GameOverError: GameOverError,
    InvalidPlayerError: InvalidPlayerError,
    InvalidPositionError: InvalidPositionError,
    IncorrectPlayerError: IncorrectPlayerError,
    PositionUnavailableError: PositionUnavailableError
};
