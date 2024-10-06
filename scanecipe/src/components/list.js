// List.js
import React from 'react';
import { useIngredients } from '../IngredientsContext'; // Import the custom hook
import "../css/list.css";

const List = ({ children }) => {
  const { ingredients, addItem } = useIngredients(); // Access ingredients and addItem from context

  return (
    <div className="parent flex-parent">
      <div className="child flex-child">
        {React.cloneElement(children, { addItem })}
      </div>
      <ul className="child flex-child">
        <div>List of Foods:</div>
        {ingredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default List;
