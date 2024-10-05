// src/BarcodeScanner.js

import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';

const BarcodeScanner = () => {
  const [barcode, setBarcode] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    // Initialize Quagga
    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          target: scannerRef.current,
          constraints: {
            facingMode: 'environment', // Use the back camera on mobile devices
          },
          // Apply CSS for mirroring the camera feed
          area: { // Defines where to scan
            top: "0%",    // top offset
            right: "0%",  // right offset
            left: "0%",   // left offset
            bottom: "0%"  // bottom offset
          },
        },
        decoder: {
          readers: ['code_128_reader', 'ean_reader', 'ean_8_reader', 'code_39_reader'],
        },
      },
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('Quagga is ready to start');
        Quagga.start();
      }
    );

    // Event listener for detected barcode
    Quagga.onDetected((data) => {
      setBarcode(data.codeResult.code); // Set the detected barcode
      console.log('Detected Barcode:', data.codeResult.code); // Log to console
      // Optionally stop scanning after detecting a barcode
      Quagga.stop();
    });

    // Cleanup on component unmount
    return () => {
      Quagga.stop();
    };
  }, []);

  return (
    <div>
      <h2>Barcode Scanner</h2>
      <div
        ref={scannerRef}
        style={{
          width: '100%',
          height: '400px',
          transform: 'scale(-1, 1)', // Mirror effect
          overflow: 'hidden', // Hide any overflow
        }}
      ></div>
      {barcode && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h3>Detected Barcode:</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{barcode}</p>
          <button onClick={() => setBarcode(null)}>Scan Another</button>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;