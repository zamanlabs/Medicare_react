import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
const UserProfileContext = createContext();

// Helper function to get initial state from localStorage
const getInitialProfile = () => {
    const storedProfile = localStorage.getItem('userProfile');
    try {
        return storedProfile ? JSON.parse(storedProfile) : {
            fullName: 'John Doe',
            age: 35,
            bloodGroup: 'O+',
            medicalConditions: [],
            allergies: []
        };
    } catch (error) {
        console.error("Failed to parse user profile from localStorage", error);
        return {
            fullName: 'John Doe',
            age: 35,
            bloodGroup: 'O+',
            medicalConditions: [],
            allergies: []
        };
    }
};

// Create the Provider component
export const UserProfileProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(getInitialProfile);
    const [profileUpdated, setProfileUpdated] = useState(false);

    // Calculate profile completion percentage
    const calculateProfileCompletion = () => {
        const fields = [
            userProfile.fullName && userProfile.fullName !== 'John Doe',
            userProfile.age && userProfile.age !== 35,
            userProfile.bloodGroup && userProfile.bloodGroup !== 'O+',
            userProfile.medicalConditions && userProfile.medicalConditions.length > 0,
            userProfile.allergies && userProfile.allergies.length > 0
        ];
        
        const completedFields = fields.filter(Boolean).length;
        return Math.round((completedFields / fields.length) * 100);
    };

    // Effect to save profile to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
            // Set update flag to trigger listeners in other components
            setProfileUpdated(true);
            setTimeout(() => setProfileUpdated(false), 100); // Reset after a short delay
        } catch (error) {
            console.error("Failed to save user profile to localStorage", error);
        }
    }, [userProfile]);

    // Update the entire profile
    const updateProfile = (newProfileData) => {
        setUserProfile(prevProfile => ({
            ...prevProfile,
            ...newProfileData
        }));
    };

    // Add a medical condition
    const addMedicalCondition = (condition) => {
        setUserProfile(prevProfile => ({
            ...prevProfile,
            medicalConditions: [...prevProfile.medicalConditions, condition]
        }));
    };

    // Remove a medical condition
    const removeMedicalCondition = (index) => {
        setUserProfile(prevProfile => ({
            ...prevProfile,
            medicalConditions: prevProfile.medicalConditions.filter((_, i) => i !== index)
        }));
    };

    // Add an allergy
    const addAllergy = (allergy) => {
        setUserProfile(prevProfile => ({
            ...prevProfile,
            allergies: [...prevProfile.allergies, allergy]
        }));
    };

    // Remove an allergy
    const removeAllergy = (index) => {
        setUserProfile(prevProfile => ({
            ...prevProfile,
            allergies: prevProfile.allergies.filter((_, i) => i !== index)
        }));
    };

    // Value provided to consuming components
    const value = {
        userProfile,
        profileUpdated,
        updateProfile,
        addMedicalCondition,
        removeMedicalCondition,
        addAllergy,
        removeAllergy,
        profileCompletion: calculateProfileCompletion()
    };

    return (
        <UserProfileContext.Provider value={value}>
            {children}
        </UserProfileContext.Provider>
    );
};

// Custom hook for easy context use
export const useUserProfile = () => {
    const context = useContext(UserProfileContext);
    if (!context) {
        throw new Error('useUserProfile must be used within a UserProfileProvider');
    }
    return context;
};

export default UserProfileContext; 