import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * A custom hook for speech recognition that works across browsers
 * 
 * @param {Object} options - Configuration options
 * @param {Function} options.onResult - Callback when results are available
 * @param {Function} options.onEnd - Callback when recognition ends
 * @param {Function} options.onError - Callback when an error occurs
 * @param {string} options.language - Recognition language (default: 'en-US')
 * @returns {Object} - Speech recognition controls and state
 */
const useSpeechRecognition = (options = {}) => {
    const { 
        onResult, 
        onEnd, 
        onError, 
        language = 'en-US' 
    } = options;
    
    // Get SpeechRecognition API based on browser
    const SpeechRecognition = 
        window.SpeechRecognition || 
        window.webkitSpeechRecognition || 
        window.mozSpeechRecognition || 
        window.msSpeechRecognition;
    
    const recognitionRef = useRef(null);
    const timeoutIdRef = useRef(null);
    const isSupported = !!SpeechRecognition;

    const [isListening, setIsListening] = useState(false);
    const [finalTranscript, setFinalTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [error, setError] = useState(null);

    // Handle speech recognition results
    const handleResult = useCallback((event) => {
        // Clear any auto-stop timeout
        clearTimeout(timeoutIdRef.current);
        
        let currentInterim = '';
        let currentFinal = '';

        // Process all results
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                currentFinal += event.results[i][0].transcript;
            } else {
                currentInterim += event.results[i][0].transcript;
            }
        }

        setInterimTranscript(currentInterim);
        
        // If we have final results, update the transcript
        if (currentFinal) {
            setFinalTranscript(prev => prev + currentFinal);
            
            if (onResult) {
                onResult(currentFinal, 'final');
            }
        } else if (currentInterim && onResult) {
            onResult(currentInterim, 'interim');
        }

        // Auto-stop after a pause in speech (for better UX)
        timeoutIdRef.current = setTimeout(() => {
            if (isListening && recognitionRef.current) {
                recognitionRef.current.stop();
            }
        }, 2000); // 2 seconds silence timeout

    }, [onResult, isListening]);

    // Handle speech recognition errors
    const handleError = useCallback((event) => {
        console.error('Speech recognition error:', event.error);
        
        // Provide more user-friendly error messages
        const errorMessage = 
            event.error === 'no-speech' ? 'No speech detected. Please try again.' :
            event.error === 'audio-capture' ? 'Microphone error. Please check your device.' :
            event.error === 'not-allowed' ? 'Microphone access denied. Please check permissions.' :
            event.error === 'network' ? 'Network error. Please check your connection.' :
            event.error === 'aborted' ? 'Recognition aborted.' :
            `Speech recognition error: ${event.error}`;
        
        setError(errorMessage);
        setIsListening(false);
        
        if (onError) {
            onError(errorMessage, event.error);
        }
    }, [onError]);

    // Handle speech recognition end
    const handleEnd = useCallback(() => {
        setIsListening(false);
        
        if (onEnd) {
            onEnd(finalTranscript);
        }
    }, [onEnd, finalTranscript]);

    // Start listening function
    const startListening = useCallback(() => {
        if (!isSupported || isListening) return;

        setError(null); // Clear previous errors
        
        try {
            // Create new recognition instance
            recognitionRef.current = new SpeechRecognition();
            
            // Configure the recognition
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = language;

            // Set up event handlers
            recognitionRef.current.onresult = handleResult;
            recognitionRef.current.onerror = handleError;
            recognitionRef.current.onend = handleEnd;
            recognitionRef.current.onstart = () => setIsListening(true);

            // Start recognition
            recognitionRef.current.start();
            
            // Reset transcript for new session
            setInterimTranscript('');
            setFinalTranscript('');
            
        } catch (error) {
            console.error("Error starting speech recognition:", error);
            
            setError("Could not start speech recognition. Please try again.");
            setIsListening(false);
            
            if (onError) {
                onError("Failed to start speech recognition", "start_error");
            }
        }
    }, [isSupported, isListening, language, handleResult, handleError, handleEnd, onError]);

    // Stop listening function
    const stopListening = useCallback(() => {
        clearTimeout(timeoutIdRef.current);
        
        if (recognitionRef.current && isListening) {
            try {
                recognitionRef.current.stop();
            } catch (error) {
                console.error("Error stopping speech recognition:", error);
            }
        }
    }, [isListening]);

    // Reset the transcript
    const resetTranscript = useCallback(() => {
        setFinalTranscript('');
        setInterimTranscript('');
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearTimeout(timeoutIdRef.current);
            
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (error) {
                    // Silent error - just cleaning up
                }
                
                // Remove event listeners to prevent memory leaks
                recognitionRef.current.onresult = null;
                recognitionRef.current.onerror = null;
                recognitionRef.current.onend = null;
                recognitionRef.current.onstart = null;
            }
        };
    }, []);

    return {
        isListening,
        transcript: finalTranscript,
        interimTranscript,
        finalTranscript,
        resetTranscript,
        startListening,
        stopListening,
        isSupported,
        error,
    };
};

export default useSpeechRecognition; 