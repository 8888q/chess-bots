import './App.css';

import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";

import {RandomBot, AlphabeticalBot, ReverseAlphabeticalBot, GreedyBot, PrinciplesBot} from './bots';
import { Select, MenuItem, InputLabel, FormControl, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useState } from 'react';

const theme = createTheme({
  palette: {
    mode: "dark"
  }
});

function App() {
  const [botName, setBot] = useState("alphabetical");
  const botFuncDict = {"alphabetical": <AlphabeticalBot/>,
                       "reverseAlphabetical": <ReverseAlphabeticalBot/>,
                       "greedy": <GreedyBot/>,
                       "principles": <PrinciplesBot/>,
                       "random": <RandomBot/>
                      };
  const botTextDict = require('./descriptions.json');

  const handleChange = (event) => {
    setBot(event.target.value);
  };

  return (
    <div className="App">
      <br/>
      <h1>Miscellaneous Chess Bots</h1>
      <div className='board'>
        {botFuncDict[botName]}
      </div>
      <div className='InfoBox'>
        <div className='Select'>
          <br/>
          <ThemeProvider theme={theme}>
            <Box sx={{minWidth: 120, }}>
              <FormControl>
                <InputLabel id="demo-simple-select-label">Bot</InputLabel>
                <Select
                  value={botName}
                  label="Bot"
                  onChange={handleChange}
                  >
                  <MenuItem value={"alphabetical"}>AlphabeticalBot</MenuItem>
                  <MenuItem value={"reverseAlphabetical"}>ReverseAlphabeticalBot</MenuItem>
                  <MenuItem value={"greedy"}>GreedyBot</MenuItem>
                  <MenuItem value={"principles"}>PrinciplesBot</MenuItem>
                  <MenuItem value={"random"}>RandomBot</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </ThemeProvider>
        </div>
        <div className='Info'>
          <h3>{botTextDict[botName][0]}:</h3>
          <p>{botTextDict[botName][1]}</p>
        </div>
      </div>
    </div>
  );
}

export default App;