# HandyNote Chrome Extension Architecture

## Project Structure

```
handynote.react/
├── doc/
│   └── architecture.md
├── src/
│   ├── assets/
│   │   └── img/
│   │       ├── icon16.png
│   │       ├── icon48.png
│   │       └── icon128.png
│   ├── pages/
│   │   ├── Background/
│   │   │   └── index.ts         # Service worker for handling extension events
│   │   └── Sidepanel/
│   │       ├── index.html
│   │       ├── index.tsx        # Entry point for side panel
│   │       ├── Sidepanel.tsx    # Main side panel component
│   │       └── styles.css       # Side panel styles
│   └── manifest.json            # Extension manifest v3
├── webpack.config.js            # Build configuration
└── package.json
```

## Key Components

### Background Service Worker
- Located in `src/pages/Background/index.ts`
- Handles extension icon click events
- Controls side panel behavior
- Uses Chrome's native side panel API

### Side Panel
- Main UI component located in `src/pages/Sidepanel/`
- Built with React and TypeScript
- Uses native Chrome side panel functionality
- Styled using CSS modules

### Build System
- Uses Webpack for bundling
- TypeScript support
- Hot Module Replacement for development
- Outputs to `build/` directory

## Chrome APIs Used
- `chrome.sidePanel`: Native side panel API
- `chrome.action`: Extension icon click handling
- `chrome.storage`: (Planned) For storing user data

## Development Notes
1. Extension uses Manifest V3
2. Minimum Chrome version: 116 (for side panel support)
3. No content scripts needed - using native side panel
4. React 18 with TypeScript for type safety

## Future Considerations
- State management implementation
- Error boundaries
- Unit testing setup
- Storage strategy for notes
- Theme support
