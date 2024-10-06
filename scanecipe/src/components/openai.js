// OpenAI.js
import "../css/openai.css";
import React, { useState } from 'react';
import { useIngredients } from '../IngredientsContext'; // Import the custom hook
import { useMotion } from "../MotionContext";

const giflist = [
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXAwcGd5ZGR5dHB6YjB5dWZnNmx1ZWhucW0zZ21oczdyMjFzMzliZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5eFkI3L0xn5BkN7g2Z/giphy.webp",
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2tmOHgwa2N3bGxtMXg4dDdoaTZzOXJrNGQ5eDEwaDVwOWRwNDZscyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Fa69v6AU6oN4i0DZZc/giphy.webp",
    // "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdXRqbWtvb3E3Y3BsbHdtaTVpaDI1eTFtOHdwMnE4MHkzNHo5bWQ2NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l2SqbIFulqPMQq9nq/giphy.webp",
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHcwcXVoczB5cmhiam91YjF0NGt6cDRpdzFmaWNzZHBwYzVpcmthbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wRbrOmS9UPSYWI1dGk/giphy.webp",
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExemowZWNla3lnb3J3eHFsMWJ2M295bXR0dGlmYXg3YjJmMXM5emJ6aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Z8blEZs9alp16/giphy.webp",
    // "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExenQzdnpqbzk5Zzlvbms5bnRiY3pqeG14YW0xbGVhbGg2cmprdDlpaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CI89KUNc26qRi/giphy.webp",
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzM4dHg1ZnFuYmZ3M3J4cGh3eXRsYWZ1ajIzazloYmdyY2gwb2JnaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/73trcfdnqJmrftTy7i/giphy.webp",
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdXUzOGRkZWN0ZDh5azA3Y3ljbDUzbXM3MDlsNm41MG56Y3JkNHRobyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hUL5R6B4HYoXADpnvJ/giphy.webp",
    // "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTRiM3Vva3A4YnB6dTdiNzh3bGJjdG9pZXl2eGZ6bXJhamh4MnFuMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Jkk64Xj64mcfu/giphy.webp",
    "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGIzOXRidnRqcDNkNW0zZGs2eDZ4eHVxcHFybjNuY2RuZ3FrdWppbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l2JhyVygxHNYbrfnq/giphy.webp",
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWt2Z2RxZmxodjRxOXR6eHh6ZnI1ZTQ1MThwZGhvMHI5YWYxNDBhcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l41lPX79K0l6sIvni/giphy.webp",
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXE0Z29rNWhwNDhpeWNsb2o4YXhwNHRvdHpsa21pZjgzNzYybHRpayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/rvfw6dkrnGD9wJEEAn/giphy.webp",
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTllbTV5NnVjY2t6aG13cmhpejl6MHVuOTQ5NGNxejB5dmM2NG92aSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/O6YlvJ4ZfCxzS9T3Al/giphy.webp",
]

const OpenAI = ({addItem}) => {
    const { ingredients } = useIngredients(); // Access ingredients from context
    const { currentIndex, setCurrentIndex } = useMotion();
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const getRandomGif = () => {
        const randomIndex = Math.floor(Math.random() * giflist.length);
        return giflist[randomIndex];
    };

    const handleClick = () => {
        // Only set to next index if it's not the last one
        if (currentIndex < ingredients.length - 1) {
          setCurrentIndex(prevIndex => prevIndex + 1);
        } else {
            addItem(-1);
            setCurrentIndex(-1);
        }
    };

    const fetchRecipe = async () => {
        if (ingredients.length === 0) return; // Don't query if no ingredients

        setLoading(true);
        setResponse(''); // Clear previous response

        const API_KEY = ''; // Insert your OpenAI API key here

        handleClick();

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

    return (
        <div className="openai-container">
            <div className="button-container">
                <button className="myHref" onClick={fetchRecipe} disabled={loading || ingredients.length === 0}>
                    Create Recipe
                </button>
            </div>
            {loading ? (
                <img src={getRandomGif()} className="loading-gif" alt="Loading..." width="250" />
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