import './App.css';

import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";

import {GenericBot, RandomBot, AlphabeticalBot} from './bots';
import { Select, MenuItem, InputLabel, FormControl, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useState } from 'react';

const theme = createTheme({
  palette: {
    mode: "dark"
  }
});

function App() {
  const [botName, setBot] = useState("random");
  const botFuncDict = {"alphabetical": AlphabeticalBot, "random": RandomBot};
  const botTextDict = {
    "alphabetical": 
        ["Alphabetical Bot",
         "  When transcribing a chess game, there is a specific notation for each move. For example, moving a knight to the square a3 would look like 'Na3'. Does playing the first move alphabetically make for good play?"],
    "random": 
        ["Random Bot",
         "  This bot plays a random move out of all legal moves." ]
  }
  const chessSize = Math.floor(window.innerHeight*0.7);

  const handleChange = (event) => {
    setBot(event.target.value);
  };

  return (
    <div className="App">
      <br/>
      <h1>Miscellaneous Chess Bots</h1>
      <div className='board'>
        <GenericBot width={chessSize} height={chessSize} moveFunction={botFuncDict[botName]}/>
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
                  <MenuItem value={"random"}>RandomBot</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </ThemeProvider>
        </div>
        <div className='Info'>
          <p>{botTextDict[botName][0]}:</p>
          <p>{botTextDict[botName][1]}</p>
        </div>
      </div>
    </div>
  );
}


export default App;
