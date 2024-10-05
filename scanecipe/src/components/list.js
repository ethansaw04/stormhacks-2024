// List.js
import React, { useState } from 'react';
import "../css/list.css";

const List = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = (item) => {
    setItems((prevItems) => [...prevItems, item]);
  };

  return (
    <div class='parent flex-parent'>
        <div class='child flex-child'>
            {React.cloneElement(children, { addItem })}
        </div>
      <ul class='child flex-child'>
        <div>
            List of Foods:
        </div>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default List;
