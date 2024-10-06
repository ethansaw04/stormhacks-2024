import React, { createContext, useContext, useState } from 'react';

// Create the Ingredients Context
const IngredientsContext = createContext();

// Create a provider component
export const IngredientsProvider = ({ children }) => {
    const [ingredients, setIngredients] = useState([]);

    const addItem = (item) => {
        setIngredients((prevItems) => [...prevItems, item]);
    };

    return (
        <IngredientsContext.Provider value={{ ingredients, addItem }}>
            {children}
        </IngredientsContext.Provider>
    );
};

// Custom hook to use the IngredientsContext
export const useIngredients = () => {
    return useContext(IngredientsContext);
};
