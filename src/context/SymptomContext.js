import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the context
const SymptomContext = createContext();

// Helper function to get initial state from localStorage
const getInitialSymptoms = () => {
    const storedSymptoms = localStorage.getItem('symptoms');
    try {
        return storedSymptoms ? JSON.parse(storedSymptoms) : [];
    } catch (error) {
        console.error("Failed to parse symptoms from localStorage", error);
        return [];
    }
};

// 2. Create the Provider component
export const SymptomProvider = ({ children }) => {
    const [symptoms, setSymptoms] = useState(getInitialSymptoms);

    // Effect to save symptoms to localStorage whenever they change
    useEffect(() => {
        try {
            // Sort before saving to maintain order if needed elsewhere
            const sortedSymptoms = [...symptoms].sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date));
            localStorage.setItem('symptoms', JSON.stringify(sortedSymptoms));
        } catch (error) {
            console.error("Failed to save symptoms to localStorage", error);
        }
    }, [symptoms]);

    // Function to add a new symptom
    const addSymptom = (newSymptom) => {
        const symptomToAdd = {
            id: newSymptom.id || Date.now(),
            timestamp: newSymptom.timestamp || new Date().toISOString(), // Use consistent timestamp field
            ...newSymptom,
            date: newSymptom.date || newSymptom.timestamp || new Date().toISOString().slice(0,16) // Ensure date field exists if used
        };
        setSymptoms(prevSymptoms => {
             // Prevent duplicates if needed (optional, based on ID or content)
             // if (prevSymptoms.some(s => s.id === symptomToAdd.id)) return prevSymptoms;
             const updated = [symptomToAdd, ...prevSymptoms];
             updated.sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)); // Sort after adding
             return updated;
        });
    };

    // Function to remove a symptom
    const removeSymptom = (symptomId) => {
        setSymptoms(prevSymptoms => prevSymptoms.filter(s => s.id !== symptomId));
    };

    // Value provided to consuming components
    const value = {
        symptoms,
        addSymptom,
        removeSymptom, // Add removeSymptom to context value
    };

    return (
        <SymptomContext.Provider value={value}>
            {children}
        </SymptomContext.Provider>
    );
};

// 3. Custom hook for easy consumption
export const useSymptoms = () => {
    const context = useContext(SymptomContext);
    if (context === undefined) {
        throw new Error('useSymptoms must be used within a SymptomProvider');
    }
    return context;
}; 