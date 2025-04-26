// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';

const AuthContext = createContext();

// API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/auth` : 'http://localhost:5000/api/auth';

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const toast = useToast();

    // Effect to update axios headers when token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, [token]);

    // Effect to update localStorage when user changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const body = JSON.stringify({ email, password });
            console.log(`Login attempt: ${email}, API URL: ${API_URL}`);
            const res = await axios.post(`${API_URL}/login`, body, config);

            if (res.data && res.data.token) {
                const userData = {
                    _id: res.data._id,
                    name: res.data.name,
                    email: res.data.email,
                };
                console.log('Login successful, received token:', res.data.token.substring(0, 20) + '...');
                setToken(res.data.token);
                setUser(userData);
                setLoading(false);
                
                toast({
                    title: "Login successful",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                
                return { success: true };
            } else {
                throw new Error("Login failed: No token received");
            }
        } catch (err) {
            const errorMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.msg || 'Login failed. Please check credentials.';
            console.error('Login Context Error:', err.response?.data || err.message);
            setError(errorMsg);
            setToken(null);
            setUser(null);
            setLoading(false);
            
            toast({
                title: "Login failed",
                description: errorMsg,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            
            return { success: false, message: errorMsg };
        }
    };

    // Add debugging method
    const debugAuth = () => {
        const currentToken = localStorage.getItem('token');
        const currentUser = localStorage.getItem('user');
        const axiosHeaders = axios.defaults.headers.common['Authorization'];
        
        console.group('Auth Debug Information');
        console.log('Token in state:', token ? `${token.substring(0, 15)}...` : 'null');
        console.log('Token in localStorage:', currentToken ? `${currentToken.substring(0, 15)}...` : 'null');
        console.log('User in state:', user);
        console.log('User in localStorage:', currentUser ? JSON.parse(currentUser) : 'null');
        console.log('Axios auth header:', axiosHeaders ? `${axiosHeaders.substring(0, 20)}...` : 'not set');
        console.log('isAuthenticated:', !!token);
        console.groupEnd();
        
        return {
            tokenInState: !!token,
            tokenInStorage: !!currentToken,
            userInState: !!user,
            userInStorage: !!currentUser,
            axiosHeaderSet: !!axiosHeaders,
            isAuthenticated: !!token
        };
    };

    const register = async (name, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const body = JSON.stringify({ name, email, password });
            const res = await axios.post(`${API_URL}/register`, body, config);

            if (res.data && res.data.token) {
                const userData = {
                    _id: res.data._id,
                    name: res.data.name,
                    email: res.data.email,
                };
                setToken(res.data.token);
                setUser(userData);
                setLoading(false);
                
                toast({
                    title: "Registration successful",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                
                return { success: true };
            } else {
                throw new Error("Registration failed: No token received");
            }
        } catch (err) {
            const errorMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.msg || 'Registration failed. Please try again.';
            console.error('Register Context Error:', err.response?.data || err.message);
            setError(errorMsg);
            setToken(null);
            setUser(null);
            setLoading(false);
            
            toast({
                title: "Registration failed",
                description: errorMsg,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            
            return { success: false, message: errorMsg };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        
        toast({
            title: "Logged out successfully",
            status: "info",
            duration: 3000,
            isClosable: true,
        });
    };

    // Fetch user data if token exists
    const fetchUser = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/me`);
            setUser({
                _id: res.data._id,
                name: res.data.name,
                email: res.data.email,
            });
            setError(null);
        } catch (err) {
            console.error("Failed to fetch user or token expired:", err.response?.data || err.message);
            logout();
            setError("Session expired. Please log in again.");
            
            toast({
                title: "Session expired",
                description: "Please log in again",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    // Load user data when the app loads if token exists
    useEffect(() => {
        if (token && !user) {
            fetchUser();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                isAuthenticated: !!token,
                loading,
                error,
                login,
                register,
                logout,
                setError,
                debugAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
}; 