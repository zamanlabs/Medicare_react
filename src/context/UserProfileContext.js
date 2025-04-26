import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { useAuth } from './AuthContext';

// Create the context
const UserProfileContext = createContext();

// API URL
const API_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/profile` : 'http://localhost:5000/api/profile';

// Create the Provider component
export const UserProfileProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState({
        fullName: '',
        age: 0,
        bloodGroup: '',
        medicalConditions: [],
        allergies: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [profileUpdated, setProfileUpdated] = useState(false);
    const toast = useToast();
    const { isAuthenticated, token } = useAuth();

    // Calculate profile completion percentage
    const calculateProfileCompletion = () => {
        // Define required and optional fields
        const requiredFields = [
            userProfile.fullName, // Required
            userProfile.age && userProfile.age > 0, // Required
            userProfile.bloodGroup, // Required
        ];
        
        const optionalFields = [
            userProfile.gender, // Optional but contributes to completion
            userProfile.weight > 0, // Optional but contributes to completion
            userProfile.height > 0, // Optional but contributes to completion
            userProfile.medicalConditions && userProfile.medicalConditions.length > 0, // Optional but contributes to completion
            userProfile.allergies && userProfile.allergies.length > 0, // Optional but contributes to completion
        ];
        
        // Count completed required fields (higher weight)
        const completedRequired = requiredFields.filter(Boolean).length;
        const requiredWeight = 0.7; // 70% weight for required fields
        
        // Count completed optional fields (lower weight)
        const completedOptional = optionalFields.filter(Boolean).length;
        const optionalWeight = 0.3; // 30% weight for optional fields
        
        // Calculate the weighted completion percentage
        const requiredPercentage = (completedRequired / requiredFields.length) * requiredWeight * 100;
        const optionalPercentage = (completedOptional / optionalFields.length) * optionalWeight * 100;
        
        return Math.round(requiredPercentage + optionalPercentage);
    };

    // Fetch user profile from backend
    const fetchProfile = async () => {
        if (!isAuthenticated) return;

        setLoading(true);
        setError(null);
        
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            
            const res = await axios.get(API_URL, config);
            
            // Map backend model fields to frontend format
            const mappedProfile = mapProfileFromBackend(res.data);
            setUserProfile(mappedProfile);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Failed to fetch profile';
            console.error('Fetch Profile Error:', errorMsg);
            setError(errorMsg);
            
            // If profile doesn't exist, create a default one
            if (err.response?.status === 404) {
                const defaultProfile = {
                    fullName: 'John Doe',
                    age: 35,
                    bloodGroup: 'O+',
                    medicalConditions: [],
                    allergies: []
                };
                await createProfile(defaultProfile);
            }
        } finally {
            setLoading(false);
        }
    };
    
    // Map backend profile fields to frontend format
    const mapProfileFromBackend = (backendProfile) => {
        if (!backendProfile) return userProfile;
        
        // Calculate age from dateOfBirth if available
        let age = 0;
        if (backendProfile.dateOfBirth) {
            const birthDate = new Date(backendProfile.dateOfBirth);
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
        }
        
        // Map all profile data
        return {
            fullName: backendProfile.name || '',
            age: age || 0,
            bloodGroup: backendProfile.bloodType || '',
            medicalConditions: backendProfile.medicalConditions || [],
            allergies: backendProfile.allergies || [],
            // Physical attributes
            gender: backendProfile.gender || '',
            height: backendProfile.height || 0,
            weight: backendProfile.weight || 0,
            // Contact info
            emergencyContact: backendProfile.emergencyContact || {},
            insuranceDetails: backendProfile.insuranceDetails || {},
            // Timestamps for audit purposes
            createdAt: backendProfile.createdAt,
            updatedAt: backendProfile.updatedAt,
        };
    };

    // Create initial profile
    const createProfile = async (profileData) => {
        if (!isAuthenticated) return;

        setLoading(true);
        setError(null);
        
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            
            const res = await axios.post(API_URL, profileData, config);
            const mappedProfile = mapProfileFromBackend(res.data);
            setUserProfile(mappedProfile);
            
            toast({
                title: 'Profile created',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Failed to create profile';
            console.error('Create Profile Error:', errorMsg);
            setError(errorMsg);
            
            toast({
                title: 'Error creating profile',
                description: errorMsg,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    // Update the entire profile
    const updateProfile = async (newProfileData) => {
        if (!isAuthenticated) return;

        setLoading(true);
        setError(null);
        
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            
            // Make sure we're sending fullName properly
            const dataToSend = { ...newProfileData };
            
            // Handle potentially problematic fields
            // Ensure we're not sending empty strings for enum fields
            if (dataToSend.gender === '') dataToSend.gender = null;
            
            // Debug what we're about to send
            console.log('Sending profile data to backend:', dataToSend);
            
            const res = await axios.put(API_URL, dataToSend, config);
            const mappedProfile = mapProfileFromBackend(res.data);
            
            console.log('Received updated profile from backend:', res.data);
            console.log('Mapped profile for frontend:', mappedProfile);
            
            setUserProfile(mappedProfile);
            setProfileUpdated(true);
            
            toast({
                title: 'Profile updated',
                description: 'Your profile has been successfully updated',
                duration: 3000,
                isClosable: true,
            });
            
            setTimeout(() => setProfileUpdated(false), 100);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Failed to update profile';
            console.error('Update Profile Error:', errorMsg);
            console.error('Full error object:', err);
            setError(errorMsg);
            
            toast({
                title: 'Error updating profile',
                description: errorMsg,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    // Add a medical condition
    const addMedicalCondition = async (condition) => {
        if (!isAuthenticated) return;

        setLoading(true);
        setError(null);
        
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            
            const res = await axios.put(`${API_URL}/medical-condition`, { condition }, config);
            const mappedProfile = mapProfileFromBackend(res.data);
            setUserProfile(mappedProfile);
            setProfileUpdated(true);
            setTimeout(() => setProfileUpdated(false), 100);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Failed to add medical condition';
            console.error('Add Condition Error:', errorMsg);
            setError(errorMsg);
            
            toast({
                title: 'Error adding condition',
                description: errorMsg,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    // Remove a medical condition
    const removeMedicalCondition = async (index) => {
        if (!isAuthenticated) return;

        setLoading(true);
        setError(null);
        
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            
            const res = await axios.delete(`${API_URL}/medical-condition/${index}`, config);
            const mappedProfile = mapProfileFromBackend(res.data);
            setUserProfile(mappedProfile);
            setProfileUpdated(true);
            setTimeout(() => setProfileUpdated(false), 100);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Failed to remove medical condition';
            console.error('Remove Condition Error:', errorMsg);
            setError(errorMsg);
            
            toast({
                title: 'Error removing condition',
                description: errorMsg,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    // Add an allergy
    const addAllergy = async (allergy) => {
        if (!isAuthenticated) return;

        setLoading(true);
        setError(null);
        
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            
            const res = await axios.put(`${API_URL}/allergy`, { allergy }, config);
            const mappedProfile = mapProfileFromBackend(res.data);
            setUserProfile(mappedProfile);
            setProfileUpdated(true);
            setTimeout(() => setProfileUpdated(false), 100);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Failed to add allergy';
            console.error('Add Allergy Error:', errorMsg);
            setError(errorMsg);
            
            toast({
                title: 'Error adding allergy',
                description: errorMsg,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    // Remove an allergy
    const removeAllergy = async (index) => {
        if (!isAuthenticated) return;

        setLoading(true);
        setError(null);
        
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            
            const res = await axios.delete(`${API_URL}/allergy/${index}`, config);
            const mappedProfile = mapProfileFromBackend(res.data);
            setUserProfile(mappedProfile);
            setProfileUpdated(true);
            setTimeout(() => setProfileUpdated(false), 100);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Failed to remove allergy';
            console.error('Remove Allergy Error:', errorMsg);
            setError(errorMsg);
            
            toast({
                title: 'Error removing allergy',
                description: errorMsg,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch profile when authentication state changes
    useEffect(() => {
        if (isAuthenticated) {
            fetchProfile();
        }
    }, [isAuthenticated]);

    // Value provided to consuming components
    const value = {
        userProfile,
        loading,
        error,
        profileUpdated,
        updateProfile,
        addMedicalCondition,
        removeMedicalCondition,
        addAllergy,
        removeAllergy,
        fetchProfile,
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