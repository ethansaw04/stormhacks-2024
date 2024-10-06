// index.js
import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from './serviceWorker';
import Scan from "./components/scan";
import List from "./components/list";
import OpenAI from "./components/openai";
import { IngredientsProvider } from "./IngredientsContext"; // Import the context provider

const App = () => {
  return (
    <div className="app">
      <header>
        <h1 
          style={{
            fontSize: '35px', 
            fontWeight: 'bold', 
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            transition: 'transform 0.3s, color 0.3s',
            cursor: 'pointer' 
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.color = '#ff6a00';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.color = '';
          }}
        >
          Scanecipe
      </h1>
    </header>
    <IngredientsProvider>
      <div className="main">
        <List>
          <Scan scanRate={250} covid19={true} upnqr={true} />
        </List>
        <OpenAI />
      </div>
    </IngredientsProvider>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

serviceWorker.register();