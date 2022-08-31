import React from 'react';
import bdbLogo from './images/bdb.png';
import './App.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  componentWillMount() {
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={bdbLogo} className="App-logo" alt="logo" />
        </header>
      </div>
    );
  }
}

export default App;
