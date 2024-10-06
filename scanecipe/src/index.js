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
    <IngredientsProvider>
      <div className="main">
        <List>
          <Scan scanRate={250} covid19={true} upnqr={true} />
        </List>
        <OpenAI />
      </div>
    </IngredientsProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

serviceWorker.register();