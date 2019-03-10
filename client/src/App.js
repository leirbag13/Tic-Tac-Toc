import React from 'react';
import Game from './Game';
import Client from './Client';
import './App.css';

/**
 * React component for a very simple Loader
 */
function Loader() {
  return <span>Loading...</span>
}

/**
 * Main Application
 */
class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleNewGame = this.handleNewGame.bind(this);
    this.handleMove = this.handleMove.bind(this);

    this.state = {
      isLoaded: false
    }
  }

  componentDidMount() {
    this.handleNewGame();
  }

  handleResponseFromBackend(res) {
    if (res instanceof Error) {
      this.setState({error: res.message});
    } else {
      this.setState({isLoaded: true, game: res, error: null});
    }
  }

  handleNewGame() {
    this.setState({isLoaded: false});
    Client.newGame(this.handleResponseFromBackend.bind(this));
  }

  handleMove(tileId) {
    Client.makeMove(this.state.game.id, tileId, this.handleResponseFromBackend.bind(this));
  }

  render() {
    return (
      <div className="App">
        {this.state.isLoaded ?
          <Game
            game={this.state.game}
            error={this.state.error}
            handleNewGame={this.handleNewGame}
            handleMove={this.handleMove} /> :
          <Loader />}
      </div>
    );
  }
}

export default App;
