import './App.css';

import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";

import { RandomBot } from './bots';

function App() {

  return (
    <div className="App">
      <RandomBot/>
    </div>
  );
}

export default App;
