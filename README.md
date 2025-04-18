# Zentorra Medicare React Application

This is a healthcare management application built with React, Chakra UI, and Leaflet maps.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Install the dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Leaflet Maps Integration

This application uses Leaflet for map integration. If you encounter any issues with the maps not displaying correctly:

1. Make sure the Leaflet package is properly installed:
   ```bash
   npm install leaflet
   ```

2. Check that the imports in the MapComponent and LeafletUtils are correct.

3. Verify that the custom CSS for Leaflet is being properly loaded.

## Features

- **Dashboard**: Overview of health metrics
- **Symptom Tracker**: Track and monitor symptoms
- **Medication**: Manage medications and dosages
- **Telemedicine**: Virtual doctor consultations
- **Contact**: Schedule appointments and get in touch
- **Emergency Services**: Find nearby emergency services
- **Healthcare Locations**: Find universities with medical programs and nearby hospitals
- **AI Assistant**: Get help with health-related questions

## Troubleshooting Common Issues

### Maps Not Displaying

If maps are not displaying properly:

1. Check browser console for errors
2. Ensure Leaflet CSS is properly imported
3. Verify that marker icons are properly set up
4. Try using the CDN version of Leaflet if local installation fails

### Marker Icons Not Showing

Leaflet marker icons can sometimes be problematic in webpack environments:

1. Use the LeafletUtils file which includes fixes for marker icons
2. Make sure the icon URLs are accessible
3. Consider using Leaflet plugins like react-leaflet for easier integration

## AI Health Assistant Setup

The AI Health Assistant uses Google's Gemini 2.0 Flash API. To use it:

1. Get a Gemini API key from [Google AI Studio](https://ai.google.dev/)
2. When you open the Chat page, you'll be prompted to enter your API key
3. Enter your API key in the modal and save it

### Voice-to-Text Feature

The AI Health Assistant includes voice recognition capabilities, allowing users to:

- Click the microphone button to start voice input
- Speak naturally to enter questions or commands
- See real-time transcription as they speak
- Automatically send the transcribed text to the chat input field

Notes:
- Voice recognition works best in Chrome, Edge, and Safari browsers
- Requires microphone access permission
- Currently supports English language only
- Works entirely client-side using the Web Speech API

### API Key Security

The Gemini API key is stored in your browser's localStorage and is never sent to any servers except Google's API. This means:
- Your API key stays on your device
- You'll need to enter it again if you clear your browser data
- Every user of the application will need their own API key

### API Implementation Details

The application uses the direct REST API approach to communicate with the Gemini API:

```javascript
// API endpoint
const API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Example request format
const payload = {
  contents: [{
    parts: [{ text: "Your prompt here" }]
  }],
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    maxOutputTokens: 1024
  }
};

// Making the request
fetch(`${API_ENDPOINT}?key=YOUR_API_KEY`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
});
```

### Features of the AI Health Assistant

- Real-time AI responses using Google's Gemini 2.0 Flash model
- Context-aware conversation handling
- Health-specific guidelines and guardrails
- Quick-access common health questions
- Typing indicators for better user experience
- Auto-scrolling messages
- Voice input for hands-free interaction
- Real-time speech transcription

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
