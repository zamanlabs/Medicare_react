import GeminiService from './geminiService';

const emergencyKeywords = [
    "stroke", "heart attack", "cardiac arrest", "severe bleeding", "unconscious",
    "not breathing", "difficulty breathing", "choking", "drowning", "severe burn",
    "poisoning", "overdose", "seizure", "anaphylaxis", "allergic reaction",
    "suicide", "chest pain", "severe pain", "cannot move", "paralysis", "emergency",
    "dying", "life threatening", "999", "ambulance"
];

const medicalTopics = [
    "headache", "pain", "fever", "cough", "nausea", "vomiting", "diarrhea", "rash",
    "dizzy", "dizziness", "tired", "fatigue", "swelling", "shortness of breath",
    "blood pressure", "heart rate", "pulse", "temperature", "weight", "height", "bmi",
    "diabetes", "hypertension", "asthma", "arthritis", "cancer", "cold", "flu",
    "covid", "infection", "allergy", "disease", "condition", "disorder", "syndrome",
    "head", "chest", "stomach", "back", "leg", "arm", "foot", "hand", "eye", "ear",
    "nose", "throat", "skin", "heart", "lung", "liver", "kidney", "bone", "joint",
    "muscle", "blood", "brain", "nerve",
    "surgery", "operation", "procedure", "test", "scan", "x-ray", "mri", "ct scan",
    "ultrasound", "biopsy", "vaccine", "vaccination", "immunization", "shot",
    "medicine", "medication", "drug", "pill", "tablet", "capsule", "injection",
    "antibiotic", "painkiller", "pain reliever", "vitamin", "supplement", "therapy",
    "treatment", "prescription", "dose", "dosage",
    "doctor", "physician", "nurse", "specialist", "hospital", "clinic", "emergency room",
    "pharmacy", "medical", "healthcare", "health", "appointment",
    "symptom", "diagnosis", "prognosis", "chronic", "acute", "prevention", "risk factor",
    "side effect", "contraindication", "recovery"
];

function enhancePrompt(userMessage) {
    if (!userMessage) return '';
    const trimmedMessage = userMessage.trim();
    if (trimmedMessage.split(" ").length < 4) {
        return `Regarding: "${trimmedMessage}". Can you provide some general health information about this?`;
    }
    // Basic question formatting check
    if (!trimmedMessage.endsWith("?") &&
        /^(what|how|why|can|is|are|should|tell me about)/i.test(trimmedMessage)) {
        return `${trimmedMessage}?`;
    }
    return trimmedMessage;
}

function detectEmergency(message) {
    if (!message) return false;
    const messageLower = message.toLowerCase();
    return emergencyKeywords.some(keyword => messageLower.includes(keyword));
}

function isMedicalQuery(message) {
    if (!message) return false;
    const messageLower = message.toLowerCase();
    // Check for specific medical terms or general health keywords
    return medicalTopics.some(topic => messageLower.includes(topic)) ||
           /\b(health|medical|sick|hurt|ill|diagnos|treat|prescribe|doctor|nurse)\b/i.test(messageLower);
}

function getMedicalSystemContext() {
    // System context defines the AI's role and guidelines
    return `
You are "HealthBot", a helpful AI medical assistant for the Zentorra Medicare application.
Your purpose is to provide general health information and answer medical-related questions.
Guidelines:
1.  **Disclaimer First:** ALWAYS start your response by stating: "Disclaimer: I am an AI assistant and cannot provide medical advice. Consult a healthcare professional for any health concerns."
2.  **Emergency Detection:** If the user's query seems like an emergency (e.g., mentions "chest pain", "stroke", "severe bleeding"), DO NOT attempt to answer. Instead, respond ONLY with: "EMERGENCY_DETECTED: It sounds like you might be describing a serious situation. Please call 999 or your local emergency number immediately for help."
3.  **Medical Questions Only:** Only answer questions related to health, medicine, symptoms, treatments, etc. If the question is clearly non-medical, respond politely with: "I can only answer health and medical-related questions. How can I help you with a health topic?"
4.  **No Diagnosis/Treatment:** Do NOT provide specific diagnoses or treatment plans. Offer general information only.
5.  **No Dosages:** Do NOT recommend specific medication dosages.
6.  **Professional Consultation:** Encourage users to consult healthcare professionals for personalized advice.
7.  **Concise & Factual:** Keep answers concise, factual, and easy to understand. Avoid jargon where possible.
8.  **Safety:** Do not provide information that could be harmful or encourage dangerous practices.
`;
}

const MedicalChatService = {
    processMessage: async (userMessage) => {
        const isEmergency = detectEmergency(userMessage);

        if (isEmergency) {
            return {
                response: "EMERGENCY_DETECTED: It sounds like you might be describing a serious situation. Please call 999 or your local emergency number immediately for help.",
                isEmergency: true
            };
        }

        const isMedical = isMedicalQuery(userMessage);

        if (!isMedical) {
            return {
                response: "I can only answer health and medical-related questions. How can I help you with a health topic?",
                isEmergency: false
            };
        }

        const enhancedPrompt = enhancePrompt(userMessage);
        const systemContext = getMedicalSystemContext();

        try {
            // Call the Gemini service
            const aiResponse = await GeminiService.generateResponse(enhancedPrompt, systemContext);
            return {
                response: aiResponse,
                isEmergency: false // Should be caught above if it was an emergency
            };
        } catch (error) {
            console.error("Error processing message via Gemini service:", error);
            return {
                response: "I'm sorry, there was an error trying to get an answer. Please try again later.",
                isEmergency: false
            };
        }
    },

    checkEmergency: detectEmergency // Expose the check function if needed separately
};

export default MedicalChatService; 