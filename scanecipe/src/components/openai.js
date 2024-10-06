import React, { useState } from 'react';

const OpenAI = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(''); // Clear previous response

    const API_KEY = '';

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: 'user', content: prompt }],
        }),
        });

        if (!res.ok) {
        throw new Error('Network response was not ok');
        }

        const data = await res.json();
        setResponse(data.choices[0].message.content);
    } catch (error) {
        console.error("Error fetching data from OpenAI:", error);
        setResponse('Error fetching response from OpenAI.');
    } finally {
        setLoading(false);
    }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your prompt here..."
                rows={4}
                cols={50}
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Submit'}
            </button>
            </form>
            <div>
            <h2>Response:</h2>
            <p>{response}</p>
            </div>
        </div>
    );
};

export default OpenAI;