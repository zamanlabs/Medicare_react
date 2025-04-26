import axios from 'axios';

// Define API URL with a fallback for development
const API_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api/emergency-contacts` 
  : '/api/emergency-contacts';

// For debugging - log which API URL is being used
console.log('Emergency Contacts API URL:', API_URL);

// Get user token from localStorage
const getToken = () => {
  // Get token directly from localStorage where AuthContext stores it
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No auth token found in localStorage');
  }
  return token;
};

// Create auth header with token
const getConfig = () => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
  
  if (!token) {
    console.error('Creating config without valid authorization token');
  }
  
  return config;
};

// Debug helper to log request details
const logRequestDetails = (method, endpoint, config, data = null) => {
  console.group(`Emergency Contact API Request (${method})`);
  console.log('Endpoint:', endpoint);
  console.log('Headers:', JSON.stringify(config.headers));
  console.log('Auth Token Present:', !!config.headers.Authorization);
  if (data) {
    console.log('Request Body:', JSON.stringify(data));
  }
  console.groupEnd();
};

// Log response or error details
const logResponseOrError = (success, data, error = null) => {
  if (success) {
    console.group('API Response Success');
    console.log('Status:', 'Success');
    console.log('Response Data:', data);
    console.groupEnd();
  } else {
    console.group('API Response Error');
    console.log('Status:', 'Error');
    console.log('Error Response:', error?.response?.data);
    console.log('Status Code:', error?.response?.status);
    console.log('Error Message:', error?.message);
    if (error?.response?.status === 401) {
      console.error('Authentication error - token may be invalid or expired');
    }
    console.groupEnd();
  }
};

// Get all emergency contacts
const getEmergencyContacts = async () => {
  try {
    const config = getConfig();
    logRequestDetails('GET', API_URL, config);
    
    const response = await axios.get(API_URL, config);
    logResponseOrError(true, response.data);
    return response.data;
  } catch (error) {
    logResponseOrError(false, null, error);
    throw new Error(error.response?.data?.message || 'Failed to fetch emergency contacts');
  }
};

// Create a new emergency contact
const createEmergencyContact = async (contactData) => {
  try {
    const config = getConfig();
    logRequestDetails('POST', API_URL, config, contactData);
    
    const response = await axios.post(API_URL, contactData, config);
    logResponseOrError(true, response.data);
    return response.data;
  } catch (error) {
    logResponseOrError(false, null, error);
    throw new Error(error.response?.data?.message || 'Failed to create emergency contact');
  }
};

// Update an emergency contact
const updateEmergencyContact = async (id, contactData) => {
  try {
    const config = getConfig();
    const endpoint = `${API_URL}/${id}`;
    logRequestDetails('PUT', endpoint, config, contactData);
    
    const response = await axios.put(endpoint, contactData, config);
    logResponseOrError(true, response.data);
    return response.data;
  } catch (error) {
    logResponseOrError(false, null, error);
    throw new Error(error.response?.data?.message || 'Failed to update emergency contact');
  }
};

// Delete an emergency contact
const deleteEmergencyContact = async (id) => {
  try {
    const config = getConfig();
    const endpoint = `${API_URL}/${id}`;
    logRequestDetails('DELETE', endpoint, config);
    
    const response = await axios.delete(endpoint, config);
    logResponseOrError(true, response.data);
    return response.data;
  } catch (error) {
    logResponseOrError(false, null, error);
    throw new Error(error.response?.data?.message || 'Failed to delete emergency contact');
  }
};

const emergencyContactService = {
  getEmergencyContacts,
  createEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
};

export default emergencyContactService; 