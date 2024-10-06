// OpenAI.js
import "../css/openai.css";
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
                Generate a recipe using only the given ingredients and some commonly assumed household ingredients, ensuring it’s easy to follow for an average college student.

                Make sure to include: 
                - A creative recipe title.
                - A list of ingredients with portions.
                - Step-by-step instructions.

                You can incorporate commonly found seasonings such as salt, pepper, butter, sugar, siracha, soy sauce, and oyster sauce in your recipe. These are just suggestions but you have the freedom to assume more seasonings beyond what was suggested before, just make sure it is commonly found in a household.

                # Steps

                1. **Ingredients Gathering**: Start by considering the provided ingredients and add any assumed household ingredients that would enhance flavour or preparation.
                2. **Recipe Title**: Create a catchy yet descriptive title for the recipe.
                3. **Ingredients List**: Write out all necessary ingredients with exact measurements to ensure clarity.
                4. **Prepare Instructions**: Devise clear, numbered steps that guide through the cooking process. Include timings or temperature where applicable.

                # Output Format

                The output should be in the format of a recipe with a title, a list of ingredients (specifying quantities), and a detailed instruction list. Use numbered steps in the instructions. Use HTML tags such as (but not limited to) <strong>, <br>, and <em> where necessary along with proper tab formatting you would use in an HTML website.

                # Examples

                - **Example 1:**

                <strong>Spicy Siracha Noodles</strong><br>
                <br>
                <strong>Ingredients:</strong><br>
                - 4 oz. lo mein noodles<br>
                - 2 Tbsp butter<br>
                - 1/4 tsp crushed red pepper<br>
                - 2 large eggs<br>
                - 1 Tbsp brown sugar<br>
                - 1 Tbsp soy sauce<br>
                - 2 Tbsp sriracha<br>
                - 1 green onion, sliced<br>
                <br>
                <strong>Instructions:</strong><br>
                1. Prepare the sauce by mixing brown sugar, soy sauce, and sriracha in a small bowl. Set aside.<br>
                2. Boil water for the noodles, cook them until tender, then drain.</li><br>
                3. Whisk eggs in a bowl, then scramble with red pepper in melted butter in a skillet over medium heat.<br>
                4. Combine scrambled eggs with noodles in the skillet, adding the sauce. Toss until coated.<br>
                5. Serve topped with sliced green onion.</li><br>

                # Notes

                - Ensure the ingredient list and instructions are concise, ingredient quantities are clear, and step directions simple.
                - Assume access to basic cooking utensils and methods typical for a college student setting.
                - Allow for substitutions only if they don't deviate from the assumed household items list.
                `;

            try {
                const res = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini",
                        messages: [
                            { role: "system", content: prompt },
                            {
                                role: "user",
                                content: `${ingredients.join(', ')}`,
                            },
                        ],
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
        <div className="openai-container">
            {loading ? (
                <img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXAwcGd5ZGR5dHB6YjB5dWZnNmx1ZWhucW0zZ21oczdyMjFzMzliZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5eFkI3L0xn5BkN7g2Z/giphy.webp" class="loading-gif" alt="this slowpoke moves"  width="250" />
            ) : (
                <div>
                    <h2>Generated Recipe:</h2>
                    {/* Using dangerouslySetInnerHTML to parse and display the HTML response */}
                    <div dangerouslySetInnerHTML={{ __html: response }} />
                </div>
            )}
        </div>
    );
};

export default OpenAI;
