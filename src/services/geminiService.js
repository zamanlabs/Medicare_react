// src/services/geminiService.js

// Get API key from localStorage with safe handling
const getApiKey = () => {
  try {
    // Check localStorage first (for our demo purposes)
    const localStorageKey = localStorage.getItem('gemini_api_key');
    if (localStorageKey) {
      return localStorageKey;
    }
  } catch (error) {
    // Handle case where localStorage might be disabled or restricted
    console.warn('Unable to access localStorage:', error);
  }
  
  // Fallback to default (which should be replaced in a real app)
  return 'YOUR_GEMINI_API_KEY'; 
};

// API endpoint for Gemini 2.0 Flash
const API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Pre-configured system instructions for the health assistant
const healthAssistantInstructions = `
You are ZenHealth Assistant, an AI-powered healthcare assistant for Zentorra Medicare application.
Follow these guidelines when responding to queries:

1. Provide accurate, helpful information on general health topics, managing medications, symptoms, and using the app.
2. Always clarify you're an AI assistant and not a medical professional.
3. For medical emergencies, direct users to call emergency services (999) immediately.
4. For specific medical questions, advise consulting with healthcare providers.
5. Maintain a supportive, professional tone.
6. Keep answers concise but comprehensive.
7. When discussing medications or treatments, emphasize the importance of following doctor's guidance.
8. Respect user privacy and confidentiality.
9. Highlight relevant features of the Zentorra Medicare application when appropriate.

Important note: Never make specific medical diagnoses or recommend specific treatments for individual cases.
`;

/**
 * Generates a response from the Gemini model based on the conversation history
 * @param {Array} history - Array of message objects with sender and text properties
 * @returns {Promise<string>} - The AI-generated response
 */
export const generateHealthResponse = async (history) => {
  try {
    // Get the current API key
    const apiKey = getApiKey();
    
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
      throw new Error('API key not configured. Please add your Gemini API key.');
    }
    
    // Prepare conversation history
    const userMessages = history.filter(msg => msg.sender === 'user').map(msg => msg.text);
    const lastUserMessage = userMessages[userMessages.length - 1] || "";
    
    // Create conversational context by including previous messages
    const conversationContext = history.length > 1 
      ? "Previous conversation: " + history.slice(0, -1).map(msg => 
          `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`
        ).join(". ") + "\n\n"
      : "";
    
    // Build the prompt with system instructions and conversation context
    const fullPrompt = `${healthAssistantInstructions}\n\n${conversationContext}User: ${lastUserMessage}`;
    
    // Prepare the request payload
    const payload = {
      contents: [{
        parts: [{ text: fullPrompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };
    
    // Send the request to the Gemini API
    const response = await fetch(`${API_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }
    
    // Parse and extract the response text
    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0 && 
        data.candidates[0].content && data.candidates[0].content.parts &&
        data.candidates[0].content.parts.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error("Unexpected API response format:", data);
      throw new Error("Received an unexpected response format from the API");
    }
    
  } catch (error) {
    console.error('Error generating health response:', error);
    throw new Error(error.message || 'Unable to generate a response. Please try again later.');
  }
};

/**
 * Checks if the API key is configured
 * @returns {boolean} - Whether the API key is configured
 */
export const isApiKeyConfigured = () => {
  try {
    return getApiKey() !== 'YOUR_GEMINI_API_KEY';
  } catch (error) {
    console.error('Error checking API key configuration:', error);
    return false;
  }
};

export default {
  generateHealthResponse,
  isApiKeyConfigured,
}; 