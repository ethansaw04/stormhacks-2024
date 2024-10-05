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
            facingMode: 'environment' // Use the back camera on mobile devices
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
      setBarcode(data.codeResult.code);
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
      <div ref={scannerRef} style={{ width: '100%', height: '400px' }}></div>
      {barcode && <p>Detected Barcode: {barcode}</p>}
    </div>
  );
};

export default BarcodeScanner;