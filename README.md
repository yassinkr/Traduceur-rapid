# Traducteur Rapide

A React Native translation app built with Expo and TypeScript that provides secure activation and translation services.

## Features

- **Secure Activation**: One-time activation with key storage using Expo SecureStore
- **Multi-language Translation**: Support for French, English, and Arabic
- **Copy & Share**: Easy sharing and clipboard functionality for translations
- **Offline Storage**: Persistent activation state
- **Modern UI**: Clean and intuitive user interface
- **Error Handling**: Comprehensive error states and user feedback

## Setup Instructions

### Prerequisites

- Node.js (v16 or later)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator or Android Emulator (or physical device with Expo Go)

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your API base URL:
   ```
   API_BASE_URL=https://your-api-backend.com
   ```

3. **Update app configuration**:
   Edit `app.json` and add the environment variable:
   ```json
   {
     "expo": {
       "extra": {
         "API_BASE_URL": "https://your-api-backend.com"
       }
     }
   }
   ```

### Running the App

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Choose your platform**:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on physical device

## API Endpoints

Your backend should implement these endpoints:

### POST /api/activate
Activates the app with a provided key.

**Request**:
```json
{
  "key": "activation-key-here"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Activation successful",
  "userId": "user-id",
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

### POST /api/translate
Translates text between languages.

**Request**:
```json
{
  "text": "Hello world",
  "source": "en",
  "target": "fr"
}
```

**Response**:
```json
{
  "success": true,
  "translatedText": "Bonjour le monde"
}
```


## Features Implemented

✅ **Secure Activation Flow**
- Key-based activation with backend verification
- Secure storage using Expo SecureStore
- Automatic expiration handling

✅ **Translation Interface**
- Language selection (French, English, Arabic)
- Text input with character limit
- Real-time translation via API calls
- Language swap functionality

✅ **User Experience**
- Copy to clipboard functionality
- Share translated text
- Loading states and error handling
- Clean, modern UI design

✅ **Technical Requirements**
- Full TypeScript implementation
- Modular code organization
- React Navigation integration
- Environment variable support
- Error handling and loading states

## Dependencies

- **@react-navigation/native**: Navigation framework
- **@react-navigation/stack**: Stack navigator
- **expo-secure-store**: Secure key-value storage
- **expo-clipboard**: Clipboard functionality
- **expo-sharing**: Native sharing capabilities
- **expo-constants**: Access to app configuration

## Security Features

- Activation keys stored securely using Expo SecureStore
- API calls with error handling and timeout management
- Input validation and sanitization
- Automatic session expiration

## Development Notes

- The app checks activation status on startup
- Failed activations clear stored data automatically
- Translation requests include error recovery
- All user inputs are validated before API calls

## Building for Production

1. **Configure app signing** in `app.json`
2. **Set production API endpoints** in environment variables
3. **Build the app**:
   ```bash
   expo build:ios
   expo build:android
   ```

## Support

For issues or questions:
1. Check the console logs for detailed error messages
2. Verify API endpoints are accessible
3. Ensure activation keys are valid
4. Check network connectivity

---

**Note**: This app requires a backend API that implements the activation and translation endpoints. Make sure your API is configured and accessible before running the app.