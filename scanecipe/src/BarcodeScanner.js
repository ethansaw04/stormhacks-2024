// src/BarcodeScanner.js

import React, { useEffect, useRef, useState } from 'react';
import Koder from '@maslick/koder'; // Ensure correct import

const BarcodeScanner = () => {
  const videoRef = useRef(null);
  const [scannedData, setScannedData] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const koder = new Koder();

    const initCamera = async () => {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Use the rear camera
          },
        });

        videoRef.current.srcObject = videoStream;
        videoRef.current.play();

        const detectBarcode = async () => {
          try {
            // Wait until the video is ready
            await new Promise((resolve) => {
              videoRef.current.onloadedmetadata = resolve;
            });

            // Scan the video stream
            const result = await koder.scan(videoRef.current);
            if (result) {
              setScannedData(result.data); // Store the scanned data
              setError('');
            }

            requestAnimationFrame(detectBarcode); // Continue scanning
          } catch (err) {
            console.error(err);
            setError('Error decoding the barcode');
          }
        };

        detectBarcode(); // Start scanning
      } catch (err) {
        console.error(err);
        setError('Error accessing camera');
      }
    };

    initCamera();

    return () => {
      // Cleanup when the component unmounts
      if (videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
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
