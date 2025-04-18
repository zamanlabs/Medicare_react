import { useState, useEffect } from 'react';
import { useSymptoms } from '../context/SymptomContext';
import { useMedications } from '../context/MedicationContext';

// --- Configuration ---
const WEIGHTS = {
    SYMPTOMS: 0.5,       // 50%
    MED_ADHERENCE: 0.3,  // 30%
    DOCTOR_FEEDBACK: 0.2 // 20%
};

// Placeholder - replace with actual data source (e.g., user profile context)
const MOCK_DOCTOR_FEEDBACK_SCORE = 16; // Score out of 20

// --- Helper Functions ---

// Calculate Symptom Score (0-100)
// More severe/numerous symptoms lower the score.
const calculateSymptomScore = (symptoms) => {
    if (!symptoms || symptoms.length === 0) {
        return 100; // Perfect score if no symptoms
    }

    // Map severity (1-10) to an impact level (e.g., 1-10 for simplicity)
    // Adjust this mapping based on desired sensitivity
    const getImpact = (severity) => {
        if (severity <= 3) return severity;      // Low: 1-3 impact
        if (severity <= 7) return severity * 1.5; // Moderate: 6-10.5 impact
        return severity * 2;   // High: 16-20 impact
    };

    const totalImpact = symptoms.reduce((sum, symptom) => sum + getImpact(symptom.severity), 0);
    const averageImpact = totalImpact / symptoms.length;

    // Normalize average impact to a 0-100 scale deduction
    // Max possible average impact needs consideration (e.g., if max impact is 20)
    // Simple approach: scale deduction based on average impact (max 100 deduction)
    const deduction = Math.min(100, averageImpact * 5); // Adjust multiplier (5) to control sensitivity

    return Math.max(0, 100 - deduction);
};

// Calculate Medication Adherence Score (0-100)
// Uses the function provided by MedicationContext
const calculateMedicationScore = (calculateAdherenceFunc) => {
    return calculateAdherenceFunc();
};

// Normalize Doctor Feedback Score (0-20) to 0-100
const normalizeDoctorFeedback = (scoreOutOf20) => {
    const score = Math.max(0, Math.min(20, scoreOutOf20 || 0)); // Clamp between 0 and 20
    return score * 5;
};

// --- Custom Hook ---

export const useWellnessScore = () => {
    const { symptoms } = useSymptoms();
    const { calculateAdherenceScore } = useMedications(); // Get the calculation function
    const [doctorFeedbackScore, setDoctorFeedbackScore] = useState(MOCK_DOCTOR_FEEDBACK_SCORE);

    const [wellnessScore, setWellnessScore] = useState(0);

    useEffect(() => {
        // Calculate component scores
        const symptomScore = calculateSymptomScore(symptoms);
        const medicationScore = calculateMedicationScore(calculateAdherenceScore);
        const feedbackScoreNormalized = normalizeDoctorFeedback(doctorFeedbackScore);

        // Apply weights
        const finalScore = (
            (symptomScore * WEIGHTS.SYMPTOMS) +
            (medicationScore * WEIGHTS.MED_ADHERENCE) +
            (feedbackScoreNormalized * WEIGHTS.DOCTOR_FEEDBACK)
        );

        setWellnessScore(Math.round(finalScore)); // Round to nearest integer

        // Dependencies: Recalculate when symptoms, adherence calculation method, or feedback changes.
        // Note: Adherence score itself isn't state here, but the function from context tells us when the underlying data might have changed.
    }, [symptoms, calculateAdherenceScore, doctorFeedbackScore]);

    // Potential function to update doctor feedback if needed later
    // const updateDoctorFeedback = (newScore) => setDoctorFeedbackScore(newScore);

    return wellnessScore;
    // Could also return component scores: return { wellnessScore, symptomScore, medicationScore, feedbackScoreNormalized };
}; 