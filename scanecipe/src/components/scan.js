import React, {useEffect} from "react";
import useState from 'react-usestateref';
import {beep as beepNow, WORKER_TYPE} from "../helpers";
import {CODE_TYPE} from "../transformers/base";
import {Upnqr} from "../transformers/upnqr";
import {Covid19} from "../transformers/covid19";
import "../css/scan.css";
import { motion } from 'framer-motion';

const BTN_TXT = {
  START: "SCAN",
  STOP: "STOP"
};

const CANVAS_SIZE = {
  WIDTH: 320,
  HEIGHT: 430
};

const CAPTURE_OPTIONS = {
  audio: false,
  video: {facingMode: "environment"}
}

const sw = CANVAS_SIZE.WIDTH;
const sh = CANVAS_SIZE.HEIGHT;
const dw = sw;
const dh = sh;
const dx = 0;
const dy = 0;
let sx = 0;
let sy = 0;

const crossHairSvg = "M77.125 148.02567c0-3.5774 2.73862-6.27567 6.37076-6.27567H119V117H84.0192C66.50812 117 52 130.77595 52 148.02567V183h25.125v-34.97433zM237.37338 117H202v24.75h35.18494c3.63161 0 6.69006 2.69775 6.69006 6.27567V183H269v-34.97433C269 130.77595 254.88446 117 237.37338 117zM243.875 285.4587c0 3.5774-2.73863 6.27567-6.37076 6.27567H202V317h35.50424C255.01532 317 269 302.70842 269 285.4587V251h-25.125v34.4587zM83.49576 291.73438c-3.63213 0-6.37076-2.69776-6.37076-6.27568V251H52v34.4587C52 302.70842 66.50812 317 84.0192 317H119v-25.26563H83.49576z";
const crossHairWidth = 217, crossHairHeight = 200, x0 = 53, y0 = 117;

const WEBSCRAPER = 1; //SET TO 1 IF WEBSCRAPER IS ON

export default function Scan({
  beep = true,
  decode = true,
  worker = WORKER_TYPE.WASM,
  scanRate = 250,
  bw = false,
  crosshair = true,
  upnqr = false,
  covid19 = false,
  addItem
}) {

  // Component state
  const [btnText, setBtnText] = useState(BTN_TXT.START);
  const [scanning, setScanning] = useState(false);

  const [bwOn, setBwOn, bwRef] = useState(bw);
  const [crosshairOn, setCrosshairOn, crosshairRef] = useState(crosshair);

  const [resultOpen, setResultOpen] = useState(false);
  const [transformToggle, setTransformToggle] = useState(true);
  const [rawCode, setRawCode] = useState();
  const [codeType, setCodeType] = useState();
  const [beepOn, setBeepOn] = useState(beep);

  const [video] = useState(document.createElement("video"));
  const [barcode, setBarcode] = useState();
  const [milliseconds, setMilliseconds] = useState();
  const [fooditem, setFoodItem] = useState();

  // Constants
  let qrworker = null;
  let canvasElement = null;
  let canvas = null;
  let oldTime = 0;

  const clearList = () => {
    addItem(-1); // Set the list to be empty
  };

  video.onplaying = () => {
    sx = (video.videoWidth - CANVAS_SIZE.WIDTH) / 2;
    sy = (video.videoHeight - CANVAS_SIZE.HEIGHT) / 2;
  };

  const initWorker = () => {
    qrworker = new Worker(worker + "Worker.js");
    qrworker.onmessage = async ev => {
      if (ev.data != null) {
        qrworker.terminate();
        const result = ev.data;
        await stopScan();

        let res = result.data;
        const millis = ev.data.ms;
        const rawCode = res;
        let codeType = CODE_TYPE.RAW;

        // Transform raw to UPNQR
        if (upnqr) {
          const transformer = new Upnqr();
          if (transformer.identified(res)) {
            codeType = transformer.codeType();
            res = await transformer.transform(res);
          }
        }

        // Transform raw to COVID19 certificate
        if (covid19) {
          const transformer = new Covid19();
          if (transformer.identified(res)) {
            codeType = transformer.codeType();
            res = await transformer.transform(res);
          }
        }

        setBarcode(res);
        setResultOpen(true);
        setRawCode(rawCode);
        setCodeType(codeType);
        setMilliseconds(millis);
        if (WEBSCRAPER === 1) {
          const response = await fetch('http://127.0.0.1:5000/scrape?upc=' + res);
          const data = await response.json();
          setFoodItem(data['title']); 
        } else {
          const response = await fetch('https://themealdb.com/api/json/v1/1/random.php'); //USE THIS INSTEAD OF ABOVE LINE IF NOT USING WEBSCRAPER
          const data = await response.json();
          setFoodItem(data.meals[0].strMeal); //USE THIS INSTEAD OF ABOVE LINE IF NOT USING WEBSCRAPER
        }
        if (beepOn) beepNow();
      }
    };
  };

  const startScan = async () => {
    initWorker();
    canvasElement = document.getElementById("canvas");
    canvas = canvasElement.getContext("2d", {willReadFrequently: true});

    setBtnText(BTN_TXT.STOP);
    setBarcode(null);
    setResultOpen(false);
    setTransformToggle(true);
    setRawCode(null);
    setCodeType(CODE_TYPE.RAW);

    try {
      video.srcObject = await navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS);
      video.setAttribute("playsinline", "true");
      await video.play();
      setScanning(true);

      requestAnimationFrame(tick);
    } catch (err) {
      stopScan().then();
      // console.log("stopped by the user");
      // alert(err);

      setBarcode(18085400010);
      setResultOpen(true);
      setRawCode(56781234);
      setCodeType(CODE_TYPE.RAW);
      setMilliseconds(69);
      if (WEBSCRAPER === 1) {
        const response = await fetch('http://127.0.0.1:5000/scrape?upc=' + 18085400010);
        const data = await response.json();
        setFoodItem(data['title']); 
      } else {
        const response = await fetch('https://themealdb.com/api/json/v1/1/random.php'); //USE THIS INSTEAD OF ABOVE LINE IF NOT USING WEBSCRAPER
        const data = await response.json();
        setFoodItem(data.meals[0].strMeal); //USE THIS INSTEAD OF ABOVE LINE IF NOT USING WEBSCRAPER
      }
    }
  };

  const stopScan = async () => {
    setScanning(false);
    setBtnText(BTN_TXT.START);
    await video.pause();
    if (video.srcObject) {
      video.srcObject.getVideoTracks().forEach(track => track.stop());
      video.srcObject = null;
    }
  };

  const tick = (time) => {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.drawImage(video, sx, sy, sw, sh, dx, dy, dw, dh);

      if (bwRef.current) monochromize();
      if (crosshairRef.current) drawCrosshair();
      if (scanning) requestAnimationFrame(tick);
      if (decode) recogniseQRcode(time);
    }
    requestAnimationFrame(tick);
  };

  const monochromize = () => {
    let imgd = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
    let pix = imgd.data;
    for (let i = 0; i < pix.length; i += 4) {
      let gray = pix[i] * 0.3 + pix[i + 1] * 0.59 + pix[i + 2] * 0.11;
      pix[i] = gray;
      pix[i + 1] = gray;
      pix[i + 2] = gray;
    }
    canvas.putImageData(imgd, 0, 0);
  };

  const drawCrosshair = () => {
    canvas.fillStyle = "rgba(255,255,255,0.4)";
    const shape = new Path2D(crossHairSvg);
    canvas.fill(shape);
  };

  const recogniseQRcode = (time) => {
    if (time - oldTime > scanRate) {
      oldTime = time;
      let imageData;
      if (crosshairRef.current === true)
        imageData = canvas.getImageData(x0, y0, crossHairWidth, crossHairHeight);
      else
        imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
      qrworker.postMessage({width: imageData.width, height: imageData.height});
      qrworker.postMessage(imageData, [imageData.data.buffer]);
    }
  };

  const onBtnClickHandler = async (e) => {
    e.preventDefault();
    if (scanning) await stopScan(); else await startScan();
  };

  const onCrossHairClickHandler = async (e) => {
    e.preventDefault();
    setCrosshairOn(!crosshairOn);
  };

  const onBWClickHandler = async (e) => {
    e.preventDefault();
    setBwOn(!bwOn);
  };

  const onBeepClickHandler = async (e) => {
    e.preventDefault();
    setBeepOn(!beepOn);
  };

  const startStyle = () => {
    const style = {width: 64, textAlign: "center"};
    if (scanning) return {backgroundColor: "#605a4a", ...style};
    else return {backgroundColor: "", ...style};
  };

  const xHairStyle = () => {
    if (crosshairOn) return {backgroundColor: "#f1d59f"};
    else return {backgroundColor: "#605a4a"};
  };

  const bwStyle = () => {
    if (bwOn) return {backgroundColor: "#f1d59f"};
    else return {backgroundColor: "#605a4a"};
  };

  const beepStyle = () => {
    if (beepOn) return {backgroundColor: "#f1d59f"};
    else return {backgroundColor: "#605a4a"};
  };

  const transformToggleStyle = () => {
    if (transformToggle) return {backgroundColor: "#f1d59f", padding: 12};
    else return {backgroundColor: "#605a4a", padding: 12};
  }

  useEffect(() => {}, []);

  const renderCanvas = () => {
    return <canvas id="canvas" className="scanCanvas" width={CANVAS_SIZE.WIDTH} height={CANVAS_SIZE.HEIGHT} />
  };

  const renderButtons = () => {
    return <div className="scanBtn">
      <a href="!#" className="myHref" onClick={onBtnClickHandler} style={startStyle()}>{btnText}</a>
      <a href="!#" className="myHref" onClick={onCrossHairClickHandler} style={xHairStyle()}>Frame</a>
      <a href="!#" className="myHref" onClick={onBWClickHandler} style={bwStyle()}>B/W</a>
      <a href="!#" className="myHref" onClick={onBeepClickHandler} style={beepStyle()}>Beep</a>
    </div>;
  };

  const renderScan = () => {
    return (
      <div className="scan">
        {renderCanvas()}
        {renderButtons()}
      </div>
    );
  };

  const renderQrCodeResult = () => {
    return barcode;
  }

  const renderFoodItemResult = () => {
    return fooditem;
  }

  const onClickBackHandler = (e) => {
    e.preventDefault();
    setResultOpen(false);
  };

  const onTransformToggleHandler = (e) => {
    e.preventDefault();
    setTransformToggle(!transformToggle);
    const rc = rawCode;
    const bc = barcode;
    setBarcode(rc);
    setRawCode(bc);
  };

  const renderTransformToggle = () => {
    if (codeType === CODE_TYPE.RAW) return "";
    return (
      <a href="!#"
        className="myHref"
        style={transformToggleStyle()}
        onClick={onTransformToggleHandler}>
        {transformToggle === true ? codeType : "RAW"}
      </a>
    );
  };

  const onClickCopyToClipboard = async (e) => {
    e.preventDefault();
    await navigator.clipboard.writeText(barcode);
    const btnId = document.getElementById("copyToClip");
    btnId.innerText = "DONE";
    btnId.style.backgroundColor = "#605a4a";
    setTimeout(() => {
      btnId.innerText = "COPY";
      btnId.style.backgroundColor = "#f1d59f";
    }, 1000);
  }

  const onClickAddToList = async (e) => {
    e.preventDefault();
    // await navigator.clipboard.writeText(barcode); //PUT BEHAVIOUR HERE TO ADD TO LIST
    addItem(fooditem);
    const btnId = document.getElementById("addToList");
    btnId.innerText = "ADDED TO LIST";
    btnId.style.backgroundColor = "#605a4a";
    setTimeout(() => {
      btnId.innerText = "ADD TO LIST";
      btnId.style.backgroundColor = "#f1d59f";
    }, 1000);
  }

  const onClickClearList = async (e) => {
    e.preventDefault();
    clearList(fooditem);
    const btnId = document.getElementById("clearList");
    btnId.innerText = "CLEARED LIST";
    btnId.style.backgroundColor = "#605a4a";
    setTimeout(() => {
      btnId.innerText = "CLEAR LIST";
      btnId.style.backgroundColor = "#f1d59f";
    }, 1000);
  }

  const renderCopyToClipboardBtn = () => {
    return <a href="!#" style={{padding: 12}} id="copyToClip" className="myHref"
              onClick={onClickCopyToClipboard}>COPY</a>
  }

  const renderAddToListBtn = () => {
    return <a href="!#" style={{padding: 12}} id="addToList" className="myHref"
              onClick={onClickAddToList}>ADD TO LIST</a>
  }

  const renderClearListBtn = () => {
    return <a href="!#" style={{padding: 12}} id="clearList" className="myHref"
              onClick={onClickClearList}>CLEAR LIST</a>
  }

  const renderResult = () => {
    if (resultOpen) {
      return (
        <div className="resultModal">
          <div style={{paddingTop: 40, alignItems: "right", paddingBottom: 0}}>
            Barcode:
          </div>
          <div className="result">
            {renderQrCodeResult()}
          </div>
          <div style={{paddingTop: 5, alignItems: "right", paddingBottom: 0}}>
            Barcode is food item:
          </div>
          <div className="resultFood">
            {renderFoodItemResult()}
          </div>
          {/* <div style={{paddingTop: 10, alignItems: "right"}}>
            Decoding took {milliseconds} ms
          </div> */}
          <div style={{marginTop: 40}}>
            <a href="!#" style={{padding: 12}} className="myHref" onClick={onClickBackHandler}>BACK</a>
            {renderTransformToggle()}
            {renderCopyToClipboardBtn()}
            {renderAddToListBtn()}
            {renderClearListBtn()}
          </div>
        </div>);
    }
  };

  return (
    <div>
      {renderScan()}
      {renderResult()}
    </div>
  )
};
