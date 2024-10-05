import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException  } from '@zxing/library';

const BarcodeScanner = () => {
  const videoRef = useRef(null);
  const [scannedData, setScannedData] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReader
      .listVideoInputDevices()
      .then((videoInputDevices) => {
        const selectedDeviceId = videoInputDevices[0].deviceId; // Use the first device

        // Start the video stream
        codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, err) => {
          if (result) {
            setScannedData(result.text); // Store the scanned data
            setError('');
          }
          if (err && !(err instanceof NotFoundException)) {
            console.error(err);
            setError('Error scanning the barcode');
          }
        });
      })
      .catch((err) => {
        console.error(err);
        setError('Error accessing camera');
      });

    // Cleanup function to stop scanning when the component unmounts
    return () => {
      codeReader.reset();
    };
  }, []);

  return (
    <div>
      <h1>Barcode Scanner</h1>
      <video ref={videoRef} style={{ width: '100%', maxWidth: '600px' }} />
      {scannedData && <h2>Scanned Data: {scannedData}</h2>}
      {error && <h2 style={{ color: 'red' }}>{error}</h2>}
    </div>
  );
};

export default BarcodeScanner;
