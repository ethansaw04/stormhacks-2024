// OpenAI.js
import React, { useState, useEffect } from 'react';
import { useIngredients } from '../IngredientsContext'; // Import the custom hook

const OpenAI = () => {
    const { ingredients } = useIngredients(); // Access ingredients from context
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            if (ingredients.length === 0) return; // Don't query if no ingredients

            setLoading(true);
            setResponse(''); // Clear previous response

            const API_KEY = ''; // Insert your OpenAI API key here

            const prompt = `
                You are a expert cook who has an abundance of knowledge on recipes.
                You are tasked with coming up with nice simple recipes with only the given ingredients you are prompted with.

                The list of ingredients you can use are: ${ingredients.join(', ')}.`;

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

        fetchRecipe();
    }, [ingredients]); // Fetch recipe every time the ingredients change

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <h2>Generated Recipe:</h2>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
};

export default OpenAI;
