# Daniel Creed - AI Resume Chatbot

An interactive React application that allows users to ask questions about Daniel Creed's professional background using both text and voice input. The chatbot provides intelligent responses about experience, skills, and career information.

## Features

- 🤖 **AI-Powered Responses**: Get intelligent answers about Daniel's professional background
- 🎤 **Voice Recognition**: Ask questions using speech-to-text functionality
- 🔊 **Text-to-Speech**: Hear responses read aloud automatically
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Clean, professional interface with Cloudflare branding
- 🛡️ **Error Handling**: Robust error boundaries and user feedback

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
Includes tests for component rendering and functionality.

### `npm run build`

Builds the app for production to the `build` folder.\
The build is optimized for best performance with minified files and hashed filenames.

### `npm run lint`

Runs ESLint to check for code quality issues and potential bugs.

### `npm run format`

Formats code using Prettier for consistent styling.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ProfileHeader.js  # Header with profile image and title
│   ├── VoiceControls.js  # Speech recognition controls
│   ├── ChatInterface.js  # Text input and response display
│   └── ErrorBoundary.js  # Error handling component
├── services/            # Business logic and API calls
│   └── aiService.js     # AI chatbot API integration
├── styles/              # Styling and theming
│   └── theme.js         # Color scheme and constants
├── SoundMeter.js        # Audio visualization component
└── App.js               # Main application component
```

## Environment Configuration

The application supports environment variables for customization:

```env
REACT_APP_API_URL=/ask
REACT_APP_PROFILE_IMAGE_URL=https://resume-worker.dan-creed.workers.dev/profile.jpg
REACT_APP_BADGE_IMAGE_URL=https://images.credly.com/images/...
REACT_APP_SPEECH_LANGUAGE=en-US
REACT_APP_PRIMARY_COLOR=#ff7000
REACT_APP_SECONDARY_COLOR=#ffb066
```

## Technology Stack

- **React 19.1.1** - Modern React with hooks and functional components
- **React Speech Recognition** - Browser-based speech-to-text functionality
- **Web Speech API** - Text-to-speech for audio responses
- **Cloudflare Workers** - Backend API for AI responses
- **Canvas API** - Audio visualization for voice input

## Browser Compatibility

- **Voice Recognition**: Chrome, Edge, Safari (latest versions)
- **Text-to-Speech**: All modern browsers
- **Core Functionality**: All modern browsers (IE11+ with polyfills)

## Development

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
git clone https://github.com/dancreed/resume-ui.git
cd resume-ui
npm install
npm start
```

### Testing

```bash
npm test                    # Run tests in watch mode
npm test -- --coverage     # Run with coverage report
```

### Building for Production

```bash
npm run build              # Create production build
npm run build -- --analyze # Analyze bundle size
```

## Deployment

The application is designed to work with:
- **Cloudflare Pages** (recommended)
- **Netlify**
- **Vercel** 
- Any static hosting provider

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary to Daniel Creed.

## Contact

Daniel Creed - [GitHub](https://github.com/dancreed)
