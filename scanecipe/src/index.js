// index.js
import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from './serviceWorker';
import Scan from "./components/scan";
import List from "./components/list";
import OpenAI from "./components/openai";
import { IngredientsProvider } from "./IngredientsContext"; // Import the context provider
import { MotionProvider } from "./MotionContext";

import { AnimatedBackground } from 'animated-backgrounds';

const App = () => {
  return (
    <div className="app">
      <AnimatedBackground animationName="fallingFoodFiesta" />
      <header>
        <h1 
          style={{
            fontSize: '35px', 
            fontWeight: 'bold', 
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            transition: 'transform 0.3s, color 0.3s',
            cursor: 'pointer' ,
            transform: 'scale(1.1)',
            color: '#ff6a00'
          }}
          // onMouseOver={(e) => {
          //   e.currentTarget.style.transform = 'scale(1.1)';
          //   e.currentTarget.style.color = '#ff6a00';
          // }}
          // onMouseOut={(e) => {
          //   e.currentTarget.style.transform = 'scale(1)';
          //   e.currentTarget.style.color = '';
          // }}
        >
          🍦🍩🍣🌮Barcode🥓Bytes🍔🍕🌭🍟
      </h1>
    </header>
    <IngredientsProvider>
      <MotionProvider>
        <div className="main">
          <List>
            <Scan scanRate={250} covid19={true} upnqr={true} />
          </List>
          <OpenAI />
        </div>
      </MotionProvider>
    </IngredientsProvider>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

serviceWorker.register();