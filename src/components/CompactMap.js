import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@chakra-ui/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { userIcon, hospitalIcon, initializeMap } from '../utils/LeafletUtils';

const CompactMap = ({ userLocation, hospital, height = "100px", width = "100%" }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [mapReady, setMapReady] = useState(false);
  const isMountedRef = useRef(true);  // Add this ref to track component mount state

  // Initialize map when the component mounts
  useEffect(() => {
    isMountedRef.current = true;  // Set to true on mount
    
    // Wait a small amount of time to ensure the DOM is fully rendered
    const initTimer = setTimeout(() => {
      // Only initialize if component is still mounted and container exists
      if (mapRef.current && !mapInstanceRef.current && isMountedRef.current) {
        try {
          // Set initial view based on user location or default
          const initialCenter = userLocation 
            ? [userLocation.latitude, userLocation.longitude] 
            : [51.505, -0.09]; // Default location (London)
          
          // Initialize the map
          const mapInstance = initializeMap(mapRef.current, {
            center: initialCenter,
            zoom: 13,
            zoomControl: false, // Hide zoom controls for compact view
            attributionControl: false // Hide attribution for compact view
          });
          
          // Store the map instance in the ref
          mapInstanceRef.current = mapInstance;
          
          // Force a recomputation of the map's size after a short delay
          setTimeout(() => {
            if (mapInstanceRef.current && isMountedRef.current) {
              mapInstanceRef.current.invalidateSize();
              setMapReady(true);
            }
          }, 200);
        } catch (err) {
          console.error("Error initializing map:", err);
        }
      }
    }, 100);

    // Cleanup function
    return () => {
      isMountedRef.current = false;  // Set to false on unmount
      clearTimeout(initTimer);
      
      // Clean up markers first
      if (markersRef.current.length > 0) {
        markersRef.current.forEach(marker => {
          if (marker) {
            try {
              marker.remove();
            } catch (e) {
              // Silently handle any cleanup errors
            }
          }
        });
        markersRef.current = [];
      }
      
      // Clean up the map
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // Silently handle any cleanup errors
        }
        mapInstanceRef.current = null;
      }
    };
  }, []); // Only run on mount and unmount

  // Update map when user location or hospital changes
  useEffect(() => {
    // Only update markers if the map is ready and component is mounted
    if (!mapReady || !mapInstanceRef.current || !isMountedRef.current) return;
    
    try {
      // Clear existing markers safely
      markersRef.current.forEach(marker => {
        if (marker) {
          try {
            marker.remove();
          } catch (e) {
            // Silently handle any marker removal errors
          }
        }
      });
      markersRef.current = [];

      // Ensure the map is valid before adding markers
      if (!mapInstanceRef.current._container) return;
      
      // Make sure the map knows its size
      mapInstanceRef.current.invalidateSize();

      // If we have both user location and hospital, add markers and create bounds
      if (userLocation && hospital) {
        try {
          // Add user marker
          const userMarker = L.marker(
            [userLocation.latitude, userLocation.longitude], 
            { icon: userIcon }
          ).addTo(mapInstanceRef.current);
          
          // Add hospital marker
          const hospitalMarker = L.marker(
            [hospital.location.latitude, hospital.location.longitude], 
            { icon: hospitalIcon }
          ).addTo(mapInstanceRef.current);
          
          // Store markers for later cleanup
          markersRef.current = [userMarker, hospitalMarker];
          
          // Create a bounds object and fit the map to show both markers
          const bounds = L.latLngBounds(
            [userLocation.latitude, userLocation.longitude],
            [hospital.location.latitude, hospital.location.longitude]
          );
          
          // Use a try-catch block to handle potential errors during bounds adjustment
          try {
            // Use invalidateSize before fitting bounds to ensure the map container is ready
            mapInstanceRef.current.invalidateSize();
            mapInstanceRef.current.fitBounds(bounds, { 
              padding: [20, 20],
              maxZoom: 15
            });
          } catch (err) {
            console.error("Error fitting bounds:", err);
          }
        } catch (err) {
          console.error("Error adding markers to map:", err);
        }
      }
      // If we only have user location
      else if (userLocation) {
        try {
          const userMarker = L.marker(
            [userLocation.latitude, userLocation.longitude], 
            { icon: userIcon }
          ).addTo(mapInstanceRef.current);
          
          markersRef.current = [userMarker];
          
          // Use a try-catch block to handle potential errors during view change
          try {
            // Use invalidateSize before setting view
            mapInstanceRef.current.invalidateSize();
            mapInstanceRef.current.setView([userLocation.latitude, userLocation.longitude], 13);
          } catch (err) {
            console.error("Error setting view:", err);
          }
        } catch (err) {
          console.error("Error adding user marker to map:", err);
        }
      }
    } catch (error) {
      console.error("Error updating map markers:", error);
    }
  }, [userLocation, hospital, mapReady]);

  // Force map to recalculate its container size whenever dimensions change
  useEffect(() => {
    if (mapReady && mapInstanceRef.current && isMountedRef.current) {
      // Use a short timeout to ensure the DOM has updated
      const resizeTimer = setTimeout(() => {
        try {
          if (mapInstanceRef.current && mapInstanceRef.current._container && isMountedRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        } catch (err) {
          console.error("Error resizing map:", err);
        }
      }, 100);
      
      return () => clearTimeout(resizeTimer);
    }
  }, [mapReady, height, width]);

  return (
    <Box 
      ref={mapRef} 
      height={height} 
      width={width} 
      borderRadius="md" 
      overflow="hidden"
      border="1px solid"
      borderColor="gray.200"
      className="leaflet-container"
      data-testid="compact-map-container"
    />
  );
};

export default CompactMap; 