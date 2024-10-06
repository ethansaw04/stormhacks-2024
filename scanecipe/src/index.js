import ReactDom from "react-dom";
import * as serviceWorker from './serviceWorker';
import Scan from "./components/scan";
import List from "./components/list";
import OpenAI from "./components/openai";

ReactDom.render((
    <div className="main">
      <List>
        <Scan scanRate={250} covid19={true} upnqr={true}/>
      </List>
      <OpenAI />
    </div>
), document.getElementById("app"));

serviceWorker.register();
