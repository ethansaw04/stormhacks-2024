import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const BarcodeScanner = () => {
    const [result, setResult] = useState('No result');
    const [error, setError] = useState('');

    const handleScan = (data) => {
        if (data) {
            setResult(data);
            setError(''); // Clear any previous errors
        }
    };

    const handleError = (err) => {
        setError(err.message);
        console.error(err);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result)
            .then(() => {
                alert('Scanned data copied to clipboard!');
            })
            .catch((err) => {
                console.error('Could not copy text: ', err);
            });
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Barcode Scanner</h1>
            <QrReader
                onError={handleError}
                onScan={handleScan}
                style={{ width: '100%', maxWidth: '400px', margin: 'auto' }}
                facingMode="environment" // Use the back camera on mobile devices
                videoStyle={{ transform: 'scaleX(-1)' }} // Mirroring effect
            />
            <div style={{ marginTop: '20px' }}>
                <p><strong>Scanned Data:</strong> {result}</p>
                {result !== 'No result' && (
                    <button onClick={copyToClipboard}>
                        Copy to Clipboard
                    </button>
                )}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default BarcodeScanner;
