import React from 'react';

/**
 * React component for each square on the tic-tac-toe board
 */
class Tile extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.handleMove(parseInt(e.target.value, 10));
  }

  render() {
    let cellContent;
    if (this.props.tile.value) {
      cellContent = <div className="occupied">{this.props.tile.value}</div>;

    } else if (this.props.winner) {
      cellContent = <div></div>;

    } else {
      cellContent = (
        <button className="available"
          name="move"
          onClick={this.handleClick}
          value={this.props.tile.id} />
      );
    }
    return (
      <td className="tile">
        {cellContent}
      </td>
    );
  }
}

/**
 * React component for the entire tic-tac-toe board
 */
function Board(props) {
  return (
    <table className="board">
      <tbody>
        <tr>
          <Tile tile={props.tiles[0]} winner={props.winner} handleMove={props.handleMove} />
          <Tile tile={props.tiles[1]} winner={props.winner} handleMove={props.handleMove} />
          <Tile tile={props.tiles[2]} winner={props.winner} handleMove={props.handleMove} />
        </tr>
        <tr>
          <Tile tile={props.tiles[3]} winner={props.winner} handleMove={props.handleMove} />
          <Tile tile={props.tiles[4]} winner={props.winner} handleMove={props.handleMove} />
          <Tile tile={props.tiles[5]} winner={props.winner} handleMove={props.handleMove} />
        </tr>
        <tr>
          <Tile tile={props.tiles[6]} winner={props.winner} handleMove={props.handleMove} />
          <Tile tile={props.tiles[7]} winner={props.winner} handleMove={props.handleMove} />
          <Tile tile={props.tiles[8]} winner={props.winner} handleMove={props.handleMove} />
        </tr>
      </tbody>
    </table>
  );
}

/**
 * React component to start/reset the game
 */
class Control extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.handleNewGame();
  }

  render() {
    return (
      <div className="control">
        <span>{this.props.feedback}</span>
        <button name="restart" onClick={this.handleClick}>New Game</button>
      </div>
    );
  }
}

/**
 * React component for the game view
 */
function Game(props) {
  let feedback = props.error;

  if (props.game.winner) {
    feedback = "Player " + props.game.winner + " has won!";
  }
  return (
    <form className="App">
      <Board winner={props.game.winner} tiles={props.game.tiles} handleMove={props.handleMove} />
      <Control feedback={feedback} handleNewGame={props.handleNewGame} />
    </form>
  );
}

export default Game;