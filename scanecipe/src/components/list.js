// List.js
import React from 'react';
import { useIngredients } from '../IngredientsContext'; // Import the custom hook
import "../css/list.css";
import { motion } from 'framer-motion';
import { useMotion } from '../MotionContext';

const List = ({ children }) => {
  const { ingredients, addItem } = useIngredients(); // Access ingredients and addItem from context

  const { currentIndex, setCurrentIndex } = useMotion();

  const handleClick = () => {
    // Only set to next index if it's not the last one
    if (currentIndex < ingredients.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
        addItem(-1);
        setCurrentIndex(-1);
    }
  };

  return (
    <div className="parent flex-parent">
      <div className="child flex-child">
        {React.cloneElement(children, { addItem })}
      </div>
      <ul className="child flex-child-2">
        <div>List of Foods:</div>
        {ingredients.map((item, index) => (
            <li key={index}>
                <motion.div initial={{ x: 0, y: 0, opacity: 1 }} // Initial position
                    animate={{ x: currentIndex >= index ? -210 : 0, 
                        y: currentIndex >= index ? 1000 - index * 25 : 0,
                        opacity: currentIndex >= index ? 0 : 1 }}
                    transition={{ease: [0.17, 0.67, 0.83, 0.67], opacity: { duration: 0.4 }}}
                    onAnimationComplete={() => {
                        if (currentIndex === index) {
                          handleClick();
                        }
                    }}
                    >{item}
                </motion.div>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
