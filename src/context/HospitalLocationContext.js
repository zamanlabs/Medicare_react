import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const HospitalLocationContext = createContext();

// Hospital name prefixes and suffixes for dynamic generation
const hospitalPrefixes = ['General', 'Community', 'Memorial', 'University', 'St. Mary\'s', 'Regional', 'County', 'City', 'Metro'];
const hospitalSuffixes = ['Hospital', 'Medical Center', 'Emergency Center', 'Healthcare Center', 'Trauma Center'];
const emergencyTypes = ['24/7 Emergency', 'Trauma Center', 'Emergency & Urgent Care', 'Critical Care'];

export const HospitalLocationProvider = ({ children }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [nearbyHospitals, setNearbyHospitals] = useState([]);
    const [currentAddress, setCurrentAddress] = useState('No location set');
    const [isLoading, setIsLoading] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const storedLocation = localStorage.getItem('userLocation');
        const storedHospitals = localStorage.getItem('nearbyHospitals');
        const storedAddress = localStorage.getItem('currentAddress');

        if (storedLocation) {
            setUserLocation(JSON.parse(storedLocation));
        }
        if (storedHospitals) {
            setNearbyHospitals(JSON.parse(storedHospitals));
        }
        if (storedAddress) {
            setCurrentAddress(storedAddress);
        }
    }, []);

    // Save to localStorage when data changes
    useEffect(() => {
        if (userLocation) {
            localStorage.setItem('userLocation', JSON.stringify(userLocation));
        }
        if (nearbyHospitals.length > 0) {
            localStorage.setItem('nearbyHospitals', JSON.stringify(nearbyHospitals));
        }
        if (currentAddress !== 'No location set') {
            localStorage.setItem('currentAddress', currentAddress);
        }
    }, [userLocation, nearbyHospitals, currentAddress]);

    // Update user location
    const updateUserLocation = (location) => {
        setUserLocation(location);
        setIsLoading(true);
        
        // Get address from coordinates
        fetchAddressFromCoordinates(location.latitude, location.longitude);
        
        // Find nearby hospitals based on the location
        fetchNearbyHospitals(location);
    };

    // Fetch address from coordinates (using reverse geocoding)
    const fetchAddressFromCoordinates = async (lat, lng) => {
        try {
            // Use OpenStreetMap Nominatim for reverse geocoding
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            
            if (data && data.display_name) {
                setCurrentAddress(data.display_name);
            } else {
                // Format coordinates to 4 decimal places for display as fallback
                const formattedLat = lat.toFixed(4);
                const formattedLng = lng.toFixed(4);
                setCurrentAddress(`Location: ${formattedLat}, ${formattedLng}`);
            }
        } catch (error) {
            console.error("Error fetching address:", error);
            // Format coordinates as fallback
            const formattedLat = lat.toFixed(4);
            const formattedLng = lng.toFixed(4);
            setCurrentAddress(`Location: ${formattedLat}, ${formattedLng}`);
        }
    };

    // Fetch nearby hospitals (simulation for demo)
    const fetchNearbyHospitals = (location) => {
        setIsLoading(true);
        
        // Simulate API call with timeout
        setTimeout(() => {
            // Determine the number of hospitals to display (3-5)
            const numberOfHospitals = Math.floor(Math.random() * 3) + 3;
            
            // Generate hospital data with realistic details
            const hospitals = Array.from({ length: numberOfHospitals }, (_, index) => {
                // Create a hospital with realistic data
                const prefix = hospitalPrefixes[Math.floor(Math.random() * hospitalPrefixes.length)];
                const suffix = hospitalSuffixes[Math.floor(Math.random() * hospitalSuffixes.length)];
                const emergencyType = emergencyTypes[Math.floor(Math.random() * emergencyTypes.length)];
                
                // Generate a distance (closer hospitals are more likely to appear first)
                const baseDistance = (index * 0.5) + (Math.random() * 0.5);
                const distance = baseDistance.toFixed(1);
                
                // Generate a realistic position based on user location and distance
                const angle = Math.random() * Math.PI * 2; // Random angle in radians
                const latOffset = Math.sin(angle) * (baseDistance * 0.01);
                const lngOffset = Math.cos(angle) * (baseDistance * 0.01);
                
                // Generate a phone number
                const areaCode = Math.floor(Math.random() * 800) + 200;
                const exchange = Math.floor(Math.random() * 900) + 100;
                const lineNumber = Math.floor(Math.random() * 9000) + 1000;
                const formattedPhone = `${areaCode}-${exchange}-${lineNumber}`;
                
                // Generate a street address
                const streetNumber = Math.floor(Math.random() * 9000) + 1000;
                const streets = ['Medical Center Dr', 'Hospital Way', 'Healthcare Blvd', 'Emergency Rd', 'Wellness Ave'];
                const street = streets[Math.floor(Math.random() * streets.length)];
                
                return {
                    id: Date.now() + index,
                    name: `${prefix} ${suffix}`,
                    emergencyType: emergencyType,
                    distance: `${distance} miles`,
                    address: `${streetNumber} ${street}`,
                    phone: formattedPhone,
                    isOpen: Math.random() > 0.1, // 90% chance of being open
                    location: {
                        latitude: location.latitude + latOffset,
                        longitude: location.longitude + lngOffset
                    },
                    emergencyServices: {
                        ambulance: Math.random() > 0.2,
                        traumaLevel: Math.floor(Math.random() * 3) + 1, // Trauma levels 1-3
                        er24Hours: Math.random() > 0.1
                    }
                };
            });
            
            // Sort hospitals by distance
            hospitals.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
            
            // Update state
            setNearbyHospitals(hospitals);
            setIsLoading(false);
        }, 1000);
    };

    // Get the nearest hospital (first in the sorted list)
    const getNearestHospital = () => {
        return nearbyHospitals.length > 0 ? nearbyHospitals[0] : null;
    };

    // Create directions URL for a hospital
    const getDirectionsUrl = (hospital) => {
        if (!userLocation || !hospital) return null;
        
        const { latitude, longitude } = userLocation;
        return `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(hospital.name + ' ' + hospital.address)}`;
    };

    // Value object to be provided to consumers
    const value = {
        userLocation,
        nearbyHospitals,
        currentAddress,
        isLoading,
        updateUserLocation,
        getNearestHospital,
        getDirectionsUrl
    };

    return (
        <HospitalLocationContext.Provider value={value}>
            {children}
        </HospitalLocationContext.Provider>
    );
};

// Custom hook to use the context
export const useHospitalLocation = () => {
    const context = useContext(HospitalLocationContext);
    if (context === undefined) {
        throw new Error('useHospitalLocation must be used within a HospitalLocationProvider');
    }
    return context;
}; 