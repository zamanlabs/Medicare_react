import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Text, VStack, HStack, Badge, useToast } from '@chakra-ui/react';
// Import Leaflet utilities
import { userIcon, locationIcon, universityIcon, hospitalIcon, clinicIcon, initializeMap } from '../utils/LeafletUtils';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow, faSpinner } from '@fortawesome/free-solid-svg-icons';

// Fix for marker icon issues in webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapComponent = ({ 
  onLocationChange, 
  height = "400px", 
  additionalMarkers = [], 
  additionalMarker = null 
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const additionalMarkersRef = useRef([]);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle');
  const [address, setAddress] = useState('');
  const toast = useToast();

  // Initialize map
  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      // Initialize map using utility function
      mapInstanceRef.current = initializeMap(mapRef.current);
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle user location
  useEffect(() => {
    if (location && mapInstanceRef.current) {
      // If user marker exists, update its position
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([location.latitude, location.longitude]);
      } 
      // Otherwise create a new marker
      else {
        userMarkerRef.current = L.marker([location.latitude, location.longitude], { icon: userIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup('Your current location')
          .openPopup();
      }

      // Update map view
      mapInstanceRef.current.setView([location.latitude, location.longitude], 14);

      // Get address using reverse geocoding
      fetchAddress(location.latitude, location.longitude);
    }
  }, [location]);

  // Handle additional marker
  useEffect(() => {
    if (additionalMarker && mapInstanceRef.current) {
      // Clear any previous additional markers
      additionalMarkersRef.current.forEach(marker => {
        mapInstanceRef.current.removeLayer(marker);
      });
      additionalMarkersRef.current = [];

      // Add new marker
      const marker = L.marker(
        [additionalMarker.latitude, additionalMarker.longitude], 
        { icon: locationIcon }
      )
        .addTo(mapInstanceRef.current)
        .bindPopup(additionalMarker.name || 'Selected location')
        .openPopup();
      
      additionalMarkersRef.current.push(marker);

      // If we have both user location and additional marker, create a bounding box
      if (location) {
        const bounds = L.latLngBounds(
          [location.latitude, location.longitude],
          [additionalMarker.latitude, additionalMarker.longitude]
        );
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [additionalMarker]);

  // Handle multiple additional markers with different icon types
  useEffect(() => {
    if (additionalMarkers.length > 0 && mapInstanceRef.current) {
      // Clear any previous additional markers
      additionalMarkersRef.current.forEach(marker => {
        mapInstanceRef.current.removeLayer(marker);
      });
      additionalMarkersRef.current = [];

      // Create a bounds object
      const bounds = location 
        ? L.latLngBounds([[location.latitude, location.longitude]]) 
        : L.latLngBounds();

      // Add new markers with appropriate icons based on type
      additionalMarkers.forEach(markerInfo => {
        // Select icon based on marker type
        let markerIcon = locationIcon; // default
        
        if (markerInfo.iconType === 'university') {
          markerIcon = universityIcon;
        } else if (markerInfo.iconType === 'hospital') {
          markerIcon = hospitalIcon;
        } else if (markerInfo.iconType === 'clinic') {
          markerIcon = clinicIcon;
        } else if (markerInfo.iconType === 'user') {
          markerIcon = userIcon;
        }
        
        const marker = L.marker(
          [markerInfo.latitude, markerInfo.longitude], 
          { icon: markerIcon }
        )
          .addTo(mapInstanceRef.current)
          .bindPopup(markerInfo.name || 'Location');
        
        additionalMarkersRef.current.push(marker);
        bounds.extend([markerInfo.latitude, markerInfo.longitude]);
      });

      // Fit bounds if we have at least one marker
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [additionalMarkers, location]);

  const getCurrentLocation = () => {
    setLocationStatus('loading');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          
          setLocation(newLocation);
          setLocationStatus('success');
          
          if (onLocationChange) {
            onLocationChange(newLocation);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationStatus('error');
          
          toast({
            title: "Location Error",
            description: `Could not get your location: ${error.message}`,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      );
    } else {
      setLocationStatus('error');
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by your browser",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Address information unavailable");
    }
  };

  return (
    <VStack spacing={3} align="stretch" data-testid="map-component">
      <Box 
        ref={mapRef} 
        height={height} 
        width="100%" 
        borderRadius="md" 
        overflow="hidden"
        border="1px solid"
        borderColor="gray.200"
      />
      
      <HStack justify="space-between">
        <Button
          leftIcon={<FontAwesomeIcon icon={locationStatus === 'loading' ? faSpinner : faLocationArrow} spin={locationStatus === 'loading'} />}
          colorScheme="blue"
          size="sm"
          isLoading={locationStatus === 'loading'}
          onClick={getCurrentLocation}
        >
          {location ? 'Update Location' : 'Get My Location'}
        </Button>
        
        {location && (
          <Badge colorScheme="green" py={1} px={2}>
            Location Active
          </Badge>
        )}
      </HStack>
      
      {address && (
        <Text fontSize="xs" color="gray.600">
          {address}
        </Text>
      )}
    </VStack>
  );
};

export default MapComponent; 