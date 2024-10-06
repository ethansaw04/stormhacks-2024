import React, { createContext, useContext, useState } from 'react';

const MotionContext = createContext();

// Create a provider component
export const MotionProvider = ({ children }) => {
    const [currentIndex, setCurrentIndex] = useState(-1);

    return (
        <MotionContext.Provider value={{ currentIndex, setCurrentIndex }}>
            {children}
        </MotionContext.Provider>
    );
};

export const useMotion = () => {
    return useContext(MotionContext);
};
