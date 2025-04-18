// src/services/symptomAnalyzerService.js

/**
 * Symptom Analyzer Service
 * 
 * This service analyzes user-described symptoms and suggests possible conditions
 * with appropriate medical disclaimers.
 * 
 * Enhanced with emergency detection for Bangladesh emergency services (999)
 */

// Database of common symptoms and their possible conditions
const symptomDatabase = {
  'headache': {
    possibleConditions: [
      'Tension headache', 
      'Migraine', 
      'Sinusitis', 
      'Dehydration',
      'Stress'
    ],
    severity: 'moderate',
    followUpAdvice: 'If headaches persist for more than a few days or are accompanied by fever, seek medical attention.',
    emergencySign: false
  },
  'fever': {
    possibleConditions: [
      'Common cold', 
      'Influenza', 
      'COVID-19', 
      'Infection',
      'Inflammatory conditions'
    ],
    severity: 'moderate',
    followUpAdvice: 'For high fevers (above 103°F/39.4°C), seek immediate medical attention. Otherwise, stay hydrated and rest.',
    emergencySign: false
  },
  'cough': {
    possibleConditions: [
      'Common cold', 
      'Bronchitis', 
      'Asthma', 
      'Allergies',
      'COVID-19',
      'Pneumonia'
    ],
    severity: 'moderate',
    followUpAdvice: 'If cough persists for more than two weeks or you cough up blood, see a doctor.',
    emergencySign: false
  },
  'chest pain': {
    possibleConditions: [
      'Angina', 
      'Heart attack', 
      'Pulmonary embolism', 
      'Anxiety',
      'Acid reflux'
    ],
    severity: 'severe',
    followUpAdvice: 'Chest pain, especially if sudden or severe, requires immediate medical attention.',
    emergencySign: true
  },
  'shortness of breath': {
    possibleConditions: [
      'Asthma', 
      'Anxiety', 
      'Heart failure', 
      'Pulmonary embolism',
      'COVID-19',
      'Pneumonia'
    ],
    severity: 'severe',
    followUpAdvice: 'Sudden or severe difficulty breathing requires immediate medical attention.',
    emergencySign: true
  },
  'dizziness': {
    possibleConditions: [
      'Vertigo', 
      'Low blood pressure', 
      'Dehydration', 
      'Inner ear problems',
      'Anxiety'
    ],
    severity: 'moderate',
    followUpAdvice: 'If dizziness persists or is accompanied by fainting, seek medical attention.',
    emergencySign: false
  },
  'fatigue': {
    possibleConditions: [
      'Stress', 
      'Depression', 
      'Anemia', 
      'Hypothyroidism',
      'Sleep disorders',
      'Chronic fatigue syndrome'
    ],
    severity: 'mild',
    followUpAdvice: 'If fatigue persists for more than two weeks despite adequate rest, consult a doctor.',
    emergencySign: false
  },
  'nausea': {
    possibleConditions: [
      'Food poisoning', 
      'Gastroenteritis', 
      'Pregnancy', 
      'Migraine',
      'Medication side effect'
    ],
    severity: 'moderate',
    followUpAdvice: 'If nausea persists for more than a day or is accompanied by severe abdominal pain, seek medical attention.',
    emergencySign: false
  },
  'vomiting': {
    possibleConditions: [
      'Food poisoning', 
      'Gastroenteritis', 
      'Migraine', 
      'Medication side effect',
      'Appendicitis'
    ],
    severity: 'moderate',
    followUpAdvice: 'If vomiting is severe, contains blood, or lasts more than 24 hours, seek medical attention.',
    emergencySign: false
  },
  'abdominal pain': {
    possibleConditions: [
      'Gastritis', 
      'Irritable bowel syndrome', 
      'Appendicitis', 
      'Gallstones',
      'Ulcers',
      'Pancreatitis'
    ],
    severity: 'moderate',
    followUpAdvice: 'If pain is severe, persistent, or accompanied by fever, seek immediate medical attention.',
    emergencySign: false
  },
  'rash': {
    possibleConditions: [
      'Allergic reaction', 
      'Eczema', 
      'Psoriasis', 
      'Contact dermatitis',
      'Viral infection'
    ],
    severity: 'mild',
    followUpAdvice: 'If rash is widespread, painful, or accompanies a fever, consult a doctor.',
    emergencySign: false
  },
  'joint pain': {
    possibleConditions: [
      'Arthritis', 
      'Injury', 
      'Fibromyalgia', 
      'Lupus',
      'Gout'
    ],
    severity: 'moderate',
    followUpAdvice: 'If joint pain is accompanied by swelling or limited movement, consult a doctor.',
    emergencySign: false
  },
  'sore throat': {
    possibleConditions: [
      'Common cold', 
      'Strep throat', 
      'Tonsillitis', 
      'Allergies',
      'Acid reflux'
    ],
    severity: 'mild',
    followUpAdvice: 'If sore throat is severe, lasts more than a week, or makes swallowing difficult, see a doctor.',
    emergencySign: false
  },
  'runny nose': {
    possibleConditions: [
      'Common cold', 
      'Allergies', 
      'Sinusitis', 
      'Flu'
    ],
    severity: 'mild',
    followUpAdvice: 'If symptoms persist for more than 10 days or are accompanied by high fever, consult a doctor.',
    emergencySign: false
  },
  'back pain': {
    possibleConditions: [
      'Muscle strain', 
      'Herniated disc', 
      'Sciatica', 
      'Kidney infection',
      'Arthritis'
    ],
    severity: 'moderate',
    followUpAdvice: 'If pain is severe, radiates down the legs, or is accompanied by numbness, see a doctor.',
    emergencySign: false
  }
};

// Symptom synonyms to improve matching
const symptomSynonyms = {
  'headache': ['migraine', 'head pain', 'head ache', 'head hurts', 'head is pounding'],
  'fever': ['temperature', 'high temperature', 'running a fever', 'febrile'],
  'cough': ['coughing', 'hack', 'coughing fit'],
  'chest pain': ['chest discomfort', 'chest tightness', 'chest pressure', 'heart pain'],
  'shortness of breath': ['difficulty breathing', 'can\'t breathe', 'breathlessness', 'sob', 'trouble breathing'],
  'dizziness': ['lightheaded', 'vertigo', 'feeling dizzy', 'room spinning'],
  'fatigue': ['tired', 'exhaustion', 'no energy', 'weakness', 'lethargic'],
  'nausea': ['feeling sick', 'queasy', 'upset stomach', 'want to throw up'],
  'vomiting': ['throwing up', 'puking', 'getting sick', 'emesis'],
  'abdominal pain': ['stomach ache', 'stomach pain', 'belly pain', 'tummy ache', 'abdominal cramps'],
  'rash': ['skin irritation', 'hives', 'breakout', 'skin eruption', 'red spots'],
  'joint pain': ['arthralgia', 'aching joints', 'painful joints', 'stiff joints'],
  'sore throat': ['throat pain', 'pharyngitis', 'scratchy throat', 'painful throat'],
  'runny nose': ['rhinorrhea', 'nasal discharge', 'nose running', 'nose dripping'],
  'back pain': ['backache', 'pain in back', 'spinal pain', 'lumbar pain']
};

// List of symptoms that indicate a potential emergency
const emergencySymptoms = [
  'chest pain',
  'shortness of breath',
  'severe bleeding',
  'sudden severe headache',
  'sudden confusion',
  'sudden numbness',
  'sudden weakness',
  'loss of consciousness',
  'seizure',
  'severe burn',
  'poisoning',
  'suicidal thoughts',
  // Add more emergency symptoms
  'heart attack',
  'severe chest pressure',
  'stroke',
  'brain stroke',
  'unable to breathe',
  'coughing up blood',
  'vomiting blood',
  'severe abdominal pain',
  'head injury',
  'spinal injury',
  'drowning',
  'choking',
  'severe allergic reaction',
  'anaphylaxis',
  'unresponsive',
  'unconscious',
  'not breathing',
  'paralysis',
  'snakebite',
  'gunshot',
  'stabbing',
  'major trauma',
  'high fever with stiff neck',
  'severe dehydration',
  'heat stroke',
  'frostbite',
  'electrical shock',
  'severe eye injury',
  'suicide attempt'
];

// Add Bangladesh-specific emergency phrases
const bangladeshEmergencyPhrases = [
  'hridroger aakromon', // heart attack in Bengali
  'stroke',
  'rokto jomte thaka', // blood clotting
  'matha betha', // severe headache
  'bukh beytha', // chest pain
  'shwashkoshto', // breathing difficulty
  'songga heen', // unconscious
  'nishash bondho', // not breathing
  'jor komchhe na', // fever not reducing
  'hospital dorkar', // need hospital
  'doctor dorkar', // need doctor
  'emergency',
  'joruri',
  'sonkat',
  'bipod',
  'khub oshustho', // very sick
  'ambulance',
  'rog barlo', // condition worsening
  'pran jacche', // life threatening
  '999',
  'need help now',
  'dying',
  'death',
  'critical'
];

// Merge both emergency arrays
const allEmergencyTerms = [...emergencySymptoms, ...bangladeshEmergencyPhrases];

/**
 * Analyzes user-described symptoms and suggests possible conditions
 * @param {string} userMessage - User's message describing symptoms
 * @returns {Object} Analysis results containing identified symptoms, possible conditions, and advice
 */
const analyzeSymptoms = (userMessage) => {
  const lowercaseMessage = userMessage.toLowerCase();
  
  // Check for emergency symptoms first - use the expanded list
  const emergencyFound = allEmergencyTerms.some(term => 
    lowercaseMessage.includes(term)
  );
  
  // Additionally check for emergency symptom synonyms
  const emergencySynonymFound = Object.keys(symptomSynonyms).some(symptom => 
    emergencySymptoms.includes(symptom) && 
    symptomSynonyms[symptom]?.some(synonym => lowercaseMessage.includes(synonym))
  );
  
  // Check for special emergency combinations - certain symptom combinations that indicate emergency
  let combinationEmergency = false;
  
  // Check for chest pain + other concerning symptoms (potential heart attack)
  if ((lowercaseMessage.includes('chest') && 
      (lowercaseMessage.includes('pain') || lowercaseMessage.includes('pressure') || 
       lowercaseMessage.includes('squeeze') || lowercaseMessage.includes('heavy'))) &&
      (lowercaseMessage.includes('arm') || lowercaseMessage.includes('jaw') || 
       lowercaseMessage.includes('sweat') || lowercaseMessage.includes('nausea') ||
       lowercaseMessage.includes('breathless'))) {
    combinationEmergency = true;
  }
  
  // Check for stroke symptoms (F.A.S.T)
  if ((lowercaseMessage.includes('face') && lowercaseMessage.includes('droop')) ||
      (lowercaseMessage.includes('arm') && lowercaseMessage.includes('weak')) ||
      (lowercaseMessage.includes('speech') && 
       (lowercaseMessage.includes('slur') || lowercaseMessage.includes('confused'))) ||
      ((lowercaseMessage.includes('sudden') || lowercaseMessage.includes('all of a sudden')) && 
       (lowercaseMessage.includes('numb') || lowercaseMessage.includes('weak') || 
        lowercaseMessage.includes('dizzy') || lowercaseMessage.includes('vision') ||
        lowercaseMessage.includes('trouble walk')))) {
    combinationEmergency = true;
  }
  
  // Identify recognized symptoms
  const recognizedSymptoms = [];
  
  for (const symptom in symptomDatabase) {
    // Check for direct symptom mention
    if (lowercaseMessage.includes(symptom)) {
      recognizedSymptoms.push(symptom);
      continue;
    }
    
    // Check for symptom synonyms
    if (symptomSynonyms[symptom] && symptomSynonyms[symptom].some(synonym => lowercaseMessage.includes(synonym))) {
      recognizedSymptoms.push(symptom);
    }
  }
  
  // Determine possible conditions based on recognized symptoms
  const possibleConditions = {};
  let followUpAdvice = [];
  let hasSevereSymptom = false;
  
  recognizedSymptoms.forEach(symptom => {
    const details = symptomDatabase[symptom];
    
    if (details.severity === 'severe') {
      hasSevereSymptom = true;
    }
    
    details.possibleConditions.forEach(condition => {
      if (possibleConditions[condition]) {
        possibleConditions[condition]++;
      } else {
        possibleConditions[condition] = 1;
      }
    });
    
    followUpAdvice.push(details.followUpAdvice);
  });
  
  // Sort conditions by frequency (most common first)
  const sortedConditions = Object.entries(possibleConditions)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  // Create unique follow-up advice
  const uniqueAdvice = [...new Set(followUpAdvice)];
  
  // Create result object
  const result = {
    recognizedSymptoms,
    possibleConditions: sortedConditions,
    followUpAdvice: uniqueAdvice,
    isEmergency: emergencyFound || emergencySynonymFound || combinationEmergency || hasSevereSymptom
  };
  
  return result;
};

/**
 * Formats the symptom analysis into a user-friendly response
 * @param {Object} analysis - The symptom analysis results
 * @returns {string} - Formatted response message
 */
const formatSymptomResponse = (analysis) => {
  let response = '';
  
  // Emergency warning if applicable
  if (analysis.isEmergency) {
    response += `⚠️ MEDICAL EMERGENCY DETECTED ⚠️\n\nBased on the symptoms you've described, you should seek IMMEDIATE medical attention. EMERGENCY SERVICES (999) IN BANGLADESH WILL BE CONTACTED.\n\n`;
  }
  
  // Identified symptoms
  if (analysis.recognizedSymptoms.length === 0) {
    response += `I couldn't clearly identify specific symptoms from your description. Please provide more details about what you're experiencing.\n\n`;
    return response + getDisclaimer();
  }
  
  response += `I've identified these symptoms: ${analysis.recognizedSymptoms.join(', ')}.\n\n`;
  
  // Possible conditions
  if (analysis.possibleConditions.length > 0) {
    response += `Based on these symptoms, some possible conditions might include:\n`;
    analysis.possibleConditions.slice(0, 5).forEach(condition => {
      response += `• ${condition}\n`;
    });
    response += `\n`;
  } else {
    response += `I couldn't determine specific conditions based on these symptoms alone.\n\n`;
  }
  
  // Follow-up advice
  if (analysis.followUpAdvice.length > 0) {
    if (analysis.isEmergency) {
      response += `EMERGENCY ACTION REQUIRED:\n`;
      response += `• Call 999 immediately (Bangladesh emergency services)\n`;
      response += `• Do not drive yourself to the hospital\n`;
      response += `• Stay on the phone with emergency operators\n`;
      response += `• If possible, have someone stay with you\n\n`;
    } else {
      response += `Follow-up advice:\n`;
      analysis.followUpAdvice.slice(0, 3).forEach(advice => {
        response += `• ${advice}\n`;
      });
      response += `\n`;
    }
  }
  
  // Add disclaimer
  response += getBangladeshDisclaimer();
  
  return response;
};

/**
 * Returns the standard medical disclaimer with Bangladesh context
 * @returns {string} - Medical disclaimer text
 */
const getDisclaimer = () => {
  return `DISCLAIMER: This information is provided for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read here.`;
};

/**
 * Returns a Bangladesh-specific medical disclaimer
 * @returns {string} - Bangladesh medical disclaimer text
 */
const getBangladeshDisclaimer = () => {
  return `DISCLAIMER: This information is provided for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. In case of emergency in Bangladesh, call 999 immediately. For non-emergencies, please consult with a qualified healthcare provider at your nearest hospital or clinic.`;
};

/**
 * Determines if a user message is asking about symptoms
 * @param {string} message - User's message
 * @returns {boolean} - Whether the message is a symptom question
 */
const isSymptomQuestion = (message) => {
  const lowercaseMessage = message.toLowerCase();
  
  // Check for direct symptom mentions
  for (const symptom in symptomDatabase) {
    if (lowercaseMessage.includes(symptom)) {
      return true;
    }
    
    // Check for symptom synonyms
    if (symptomSynonyms[symptom] && symptomSynonyms[symptom].some(synonym => lowercaseMessage.includes(synonym))) {
      return true;
    }
  }
  
  // Check for symptom-related phrases
  const symptomPhrases = [
    'what could be causing',
    'why do i feel',
    'why am i feeling',
    'what\'s wrong with me',
    'what is wrong with me',
    'what could this be',
    'my symptoms',
    'having symptoms',
    'might have',
    'suffering from',
    'diagnosed with',
    'do i have',
    'could i have',
    'is this',
    'should i see a doctor',
    'should i be worried',
    'is this serious',
    'health concern',
    'medical concern',
    'what condition'
  ];
  
  return symptomPhrases.some(phrase => lowercaseMessage.includes(phrase));
};

/**
 * Extracts symptoms from a user message
 * @param {string} message - User's message
 * @returns {string[]} - Array of identified symptoms
 */
const extractSymptoms = (message) => {
  const lowercaseMessage = message.toLowerCase();
  const foundSymptoms = [];
  
  // Check for direct symptom mentions
  for (const symptom in symptomDatabase) {
    if (lowercaseMessage.includes(symptom)) {
      foundSymptoms.push(symptom);
      continue;
    }
    
    // Check for symptom synonyms
    if (symptomSynonyms[symptom] && symptomSynonyms[symptom].some(synonym => lowercaseMessage.includes(synonym))) {
      foundSymptoms.push(symptom);
    }
  }
  
  return foundSymptoms;
};

/**
 * Process a user message related to symptoms and return an appropriate response
 * @param {string} message - User's message
 * @returns {Object} - Response object containing the analyzed response
 */
const processSymptomMessage = (message) => {
  // Check if this is a symptom-related question
  if (!isSymptomQuestion(message)) {
    return { isSymptomQuestion: false };
  }
  
  // Analyze symptoms
  const analysis = analyzeSymptoms(message);
  
  // Format response
  const response = formatSymptomResponse(analysis);
  
  return {
    isSymptomQuestion: true,
    isEmergency: analysis.isEmergency,
    recognizedSymptoms: analysis.recognizedSymptoms,
    response: response
  };
};

export default {
  analyzeSymptoms,
  formatSymptomResponse,
  isSymptomQuestion,
  extractSymptoms,
  processSymptomMessage
}; 