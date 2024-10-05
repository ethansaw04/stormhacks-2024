// List.js
import React, { useState } from 'react';

const List = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = (item) => {
    setItems((prevItems) => [...prevItems, item]);
  };

  return (
    <div>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      {React.cloneElement(children, { addItem })}
    </div>
  );
};

export default List;
