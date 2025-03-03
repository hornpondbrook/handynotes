# HandyNote Chrome Extension Architecture

## generation prompt

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
│   ├── data/
│   │   └── initialData.ts    # Initial data for sections and shortcuts
│   ├── pages/
│   │   ├── Background/
│   │   │   └── index.ts         # Service worker for handling extension events
│   │   └── Sidepanel/
│   │       ├── index.html
│   │       ├── index.tsx        # Entry point for side panel
│   │       ├── Sidepanel.tsx    # Main side panel component
│   │       └── styles.css       # Side panel styles
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   ├── utils/
│   │   └── storage.ts         # Utility functions for storage operations
│   └── manifest.json            # Extension manifest v3
├── webpack.config.js            # Build configuration
└── package.json
```

## Key Components

### Background Service Worker

*   Located in `src/pages/Background/index.ts`
*   Handles extension icon click events
*   Controls side panel behavior
*   Uses Chrome's native side panel API

### Side Panel

*   Main UI component located in `src/pages/Sidepanel/`
*   Built with React and TypeScript
*   Uses native Chrome side panel functionality
*   Styled using CSS modules
*   Loads and displays sections and shortcuts from local storage

### Storage Utils

*   Located in `src/utils/storage.ts`
*   Provides utility functions for CRUD operations on sections and shortcuts
*   Uses Chrome's `chrome.storage.local` API to store data
*   Generates unique IDs for sections and shortcuts

### Data Initialization

*   Located in `src/data/initialData.ts`
*   Provides initial data for sections and shortcuts
*   Exports an `initializeInitialSections` function that generates the initial data with unique IDs

### TypeScript Types

*   Located in `src/types/index.ts`
*   Defines the TypeScript types for sections and shortcuts

### Build System

*   Uses Webpack for bundling
*   TypeScript support
*   Hot Module Replacement for development
*   Outputs to `build/` directory

## Chrome APIs Used

*   `chrome.sidePanel`: Native side panel API
*   `chrome.action`: Extension icon click handling
*   `chrome.storage`: For storing user data

## Design Considerations

*   **ID Generation:**
    *   Sections are given IDs in the format `title-index`, where `title` is a URL-friendly version of the section title and `index` is a unique integer.
    *   Items are given IDs that are unique integers.
    *   The `StorageUtils` class maintains the highest section index and highest item index in local storage to ensure that IDs are never reused, even after deletion.
*   **Data Initialization:**
    *   The `initialData.ts` file exports an `initializeInitialSections` function that generates the initial data with unique IDs.
    *   This function is called when the sidepanel is loaded, if there are no sections in local storage.

## Implementation Details

*   The `StorageUtils` class provides the following methods:
    *   `initializeStorage`: Initializes the local storage with the initial data and the highest section/item indexes.
    *   `getSections`: Retrieves the sections from local storage.
    *   `setSections`: Stores the sections in local storage.
    *   `addSection`: Adds a new section to local storage.
    *   `updateSection`: Updates an existing section in local storage.
    *   `deleteSection`: Deletes a section from local storage.
    *   `generateSectionId`: Generates a unique ID for a section.
    *   `generateItemId`: Generates a unique ID for an item.
*   The `Sidepanel` component in `src/pages/Sidepanel/Sidepanel.tsx` uses the `StorageUtils` class to load and display the sections and shortcuts.

## Future Considerations

*   State management implementation
*   Error boundaries
*   Unit testing setup
*   Theme support
