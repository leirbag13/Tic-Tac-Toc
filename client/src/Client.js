/**
 * Check if the server response seems valid
 *
 * @param      {Object}  response  The response
 * @return     {Object}  The response object
 */
function checkStatus(response) {
  if (response.ok) {
    return response;
  }
  throw new Error(`HTTP Error ${response.statusText}`);
}

/**
 * Extract the payload from the server and convert it to something our
 * application can use.
 *
 * @param      {Object}  response  The response
 * @return     {Object}  An object representing the current state of the game.
 */
function parseResponse(response) {
  const result = response.json();
  if (result.error) {
    throw new Error(result.error);
  }
  return result;
}

/**
 * Submit a request for a new game to the server.
 *
 * @param      {Function}  callback  The callback on success
 * @return     {Object}    An object representing the current state of the game.
 */
function newGame(callback) {
  return fetch('api/game', {
    method: 'post',
    accept: 'application/json'
  }).then(checkStatus)
    .then(parseResponse)
    .then(callback)
    .catch(callback);
}

/**
 * Makes a move in an existing game
 *
 * @param      {String}    gameId    The game identifier
 * @param      {Integer}   position  The position on the board to make the move
 * @param      {Function}  callback  The callback on success
 * @return     {Object}    An object representing the current state of the game.
 */
function makeMove(gameId, tileId, callback) {
  return fetch(`api/game/${gameId}`, {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      player: 'X',
      tileId: tileId
    }),
    accept: 'application/json'
  }).then(checkStatus)
    .then(parseResponse)
    .then(callback)
    .catch(callback);
}

const Client = { newGame, makeMove };
export default Client;