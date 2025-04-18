import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Create Context
const MedicationContext = createContext();

// Helper to get initial state from localStorage
const getInitialMedications = () => {
    const storedMedications = localStorage.getItem('medications');
    try {
        // Ensure default state includes adherence tracking
        const meds = storedMedications ? JSON.parse(storedMedications) : [];
        return meds.map(med => ({ ...med, isTaken: med.isTaken || false })); // Default isTaken to false
    } catch (error) {
        console.error("Failed to parse medications from localStorage", error);
        return [];
    }
};

// 2. Create Provider
export const MedicationProvider = ({ children }) => {
    const [medications, setMedications] = useState(getInitialMedications);

    // Save to localStorage effect
    useEffect(() => {
        try {
            localStorage.setItem('medications', JSON.stringify(medications));
        } catch (error) {
            console.error("Failed to save medications to localStorage", error);
        }
    }, [medications]);

    // Add Medication
    const addMedication = (newMed) => {
        const medToAdd = {
            id: newMed.id || Date.now(),
            isTaken: false, // Default adherence status
            ...newMed,
        };
        setMedications(prevMeds => [medToAdd, ...prevMeds]); // Add to beginning or sort as needed
    };

    // Update Medication
    const updateMedication = (updatedMed) => {
        setMedications(prevMeds => 
            prevMeds.map(med => 
                med.id === updatedMed.id ? { ...med, ...updatedMed } : med
            )
        );
    };

    // Remove Medication
    const removeMedication = (medId) => {
        setMedications(prevMeds => prevMeds.filter(med => med.id !== medId));
    };

    // Mark Medication as Taken/Untaken (toggle adherence for simplicity)
    const toggleMedicationTaken = (medId) => {
        setMedications(prevMeds =>
            prevMeds.map(med =>
                med.id === medId ? { ...med, isTaken: !med.isTaken } : med
            )
        );
    };

    // Calculate Adherence Score (0-100)
    const calculateAdherenceScore = () => {
        if (medications.length === 0) return 100; // Perfect score if no meds prescribed
        const takenCount = medications.filter(med => med.isTaken).length;
        return Math.round((takenCount / medications.length) * 100);
    };

    const value = {
        medications,
        addMedication,
        updateMedication,
        removeMedication,
        toggleMedicationTaken,
        calculateAdherenceScore, // Provide calculation function
    };

    return (
        <MedicationContext.Provider value={value}>
            {children}
        </MedicationContext.Provider>
    );
};

// 3. Custom Hook
export const useMedications = () => {
    const context = useContext(MedicationContext);
    if (context === undefined) {
        throw new Error('useMedications must be used within a MedicationProvider');
    }
    return context;
}; 