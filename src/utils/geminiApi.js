const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
// Update model name in the URL
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

/**
 * Fetches a health tip from the Gemini API.
 * @returns {Promise<string>} A promise that resolves with the generated health tip text.
 * @throws {Error} If the API key is missing or the fetch fails.
 */
export const fetchHealthTip = async () => {
    if (!API_KEY) {
        console.error("Gemini API key (REACT_APP_GEMINI_API_KEY) is missing.");
        throw new Error("API key configuration error.");
    }

    const prompt = "Provide a concise, actionable health tip suitable for a general audience. Keep it under 25 words.";

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                // Optional: Add safety settings or generation config if needed
                // generationConfig: {
                //     temperature: 0.7,
                //     maxOutputTokens: 50,
                // },
            }),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error('Gemini API Error:', errorBody);
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        // Extract the text from the response - structure may vary slightly
        const tip = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!tip) {
            console.error('Could not extract tip from Gemini response:', data);
            throw new Error('Failed to parse health tip from API response.');
        }

        return tip.trim();

    } catch (error) {
        console.error("Error fetching health tip:", error);
        // Re-throw or return a default message
        throw error; // Allow calling component to handle UI state
    }
}; 