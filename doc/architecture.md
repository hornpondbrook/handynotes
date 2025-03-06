# HandyNote Chrome Extension Architecture

## generation prompt

--- ask

please review recent changes happened mostly in src/pages/Sidepanel and tests work done, then check existing architecture.md file, please add new materials and update existing knowledge in the file to reflect update to state architecture of the project, including design, workflwo, data flow, event flow, methodology, naming, tests and flow chart if necessary

--- response

After reviewing the changes in the Sidepanel component and tests, I'll update the architecture.md file to reflect the current state of the project.

# Architecture Document

## Overview

HandyNote is a Chrome extension that provides a convenient way to store and manage keyboard shortcuts and notes within the browser. The extension is built using React and TypeScript, with Material-UI for styling.

## Project Structure

```
handynote.react/
├── src/
│   ├── components/          # Shared components
│   ├── data/                # Initial data and constants
│   ├── pages/               # Extension pages
│   │   ├── Sidepanel/       # Sidepanel implementation
│   │   │   ├── __tests__/   # Tests for Sidepanel components
│   │   │   ├── Item.tsx     # Individual shortcut item
│   │   │   ├── Section.tsx  # Section containing items
│   │   │   └── Sidepanel.tsx # Main component
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
│       └── storage.ts       # Chrome storage utilities
├── public/                  # Static assets
├── .github/                 # GitHub workflow configurations
└── dist/                    # Build output
```

## Component Architecture

### Component Hierarchy

```
Sidepanel
└── Section (draggable)
    └── Item
```

### Component Responsibilities

1. **Sidepanel**:
   - Main container component
   - Manages sections state
   - Handles section CRUD operations
   - Implements drag-and-drop for section reordering
   - Persists data to Chrome storage

2. **Section**:
   - Displays section title and items
   - Manages edit mode for itself
   - Handles collapsing/expanding (future feature)
   - Contains delete confirmation dialog
   - Manages items within the section

3. **Item**:
   - Displays shortcut and description
   - Supports edit mode for modification
   - Handles deletion

## Data Flow

1. **Data Loading**:
   - On mount, Sidepanel loads data from Chrome storage
   - If storage is empty, initializes with default data
   - Sets local state with loaded data

2. **Data Modifications**:
   - User actions (add, edit, delete) update React state
   - State changes trigger storage updates
   - Changes persist between browser sessions

3. **Section Editing**:
   - Edit mode is controlled by Sidepanel component
   - Pre-edit state is stored to support cancellation
   - Cancellation reverts to pre-edit state without storage update
   - Save confirms changes and updates storage

## State Management

1. **Component State**:
   - React's useState for local component state
   - Sidepanel maintains the source of truth for sections data
   - Section component manages its own collapse state and edit mode
   - Item component manages its own edit state

2. **Storage**:
   - Chrome's storage.local API for persistence
   - StorageUtils abstracts storage operations
   - Keys are defined as constants for consistency

## Event Flow

1. **User Interactions**:
   - Direct manipulation through UI controls
   - Click events for editing, saving, canceling, deleting
   - Drag-and-drop for section reordering

2. **Event Handling**:
   - Events are handled at the component level
   - Callbacks are passed down from parent to child components
   - State updates trigger re-renders and potentially storage updates

## Testing Strategy

1. **Unit Testing**:
   - Jest as the test runner
   - React Testing Library for component testing
   - Tests isolated components with mock props and functions

2. **Component Testing**:
   - Test rendering in different states (view/edit mode)
   - Test user interactions (click, change, dragdrop)
   - Test state updates and callback invocations

3. **Test Organization**:
   - Tests located alongside components in __tests__ directories
   - Test files named with .test.tsx extension
   - Mock implementation of dependencies (react-beautiful-dnd, storage)

4. **Testing Methodology**:
   - Arrange-Act-Assert pattern
   - Mock external dependencies
   - Use query methods to verify rendered output
   - Simulate user interactions with fireEvent
   - Use waitFor for asynchronous operations

5. **Testing Coverage**:
   - Rendering tests for UI verification
   - Interaction tests for event handling
   - State change tests for logic verification
   - Error handling tests for robustness (planned)
   - Persistence tests for storage operations

## Future Features

1. **Collapsed Section Persistence**:
   - Store collapsed state in Chrome storage
   - Restore collapsed state on page load
   - Tests already in place (currently skipped)

2. **Error Handling Improvements**:
   - Graceful recovery from storage failures
   - User feedback for error conditions
   - Tests already in place (currently skipped)

3. **Keyboard Shortcuts**:
   - Add keyboard navigation
   - Implement shortcuts for common actions
   - Tests already in place (currently skipped)

## Development Workflow

1. **Development Environment**:
   - Use PORT=6002 npm run start for development server
   - Use npx react-devtools for component inspection

2. **Debugging**:
   - React DevTools integration for component inspection
   - Chrome DevTools for extension debugging
   - Console logging for development feedback

3. **Testing**:
   - Run tests with npm test
   - Add new tests for new features
   - Update tests when modifying existing features

## Design Principles

1. **Component Composition**:
   - Small, focused components with single responsibilities
   - Props as the API for component communication
   - Controlled components for form elements

2. **State Management**:
   - Single source of truth for important data
   - Push state up to common ancestor when needed
   - Local component state when possible

3. **Naming Conventions**:
   - PascalCase for component names
   - camelCase for variables and functions
   - BEM-like naming for CSS classes
   - Descriptive names for handlers (handleSectionEdit, handleItemDelete)

4. **Code Organization**:
   - Logical grouping of related components
   - Clear separation of concerns
   - Import dependencies in consistent order

## Flow Chart: Data and Event Flow

```
User Action → Component Event Handler → State Update → Re-render → Storage Update
     ↑                                                    |
     └────────────────────────────────────────────────────┘
                          (UI updates)
```

## Storage Architecture

1. **Keys**:
   - STORAGE_KEY: 'handynote_sections'
   - HIGHEST_SECTION_INDEX_KEY: 'handynote_highest_section_index'
   - HIGHEST_ITEM_INDEX_KEY: 'handynote_highest_item_index'
   - (Future) COLLAPSED_SECTIONS_KEY: 'handynote_collapsed_sections'

2. **Data Structure**:
   - Sections array with nested items
   - Each section and item has unique ID
   - IDs are used for targeting operations and state management

3. **Operations**:
   - getSections(): Load all sections
   - setSections(sections): Save all sections
   - Other utility methods for specific operations

## Configuration Management

### Constants and Configuration
The application uses a centralized configuration approach for maintainability:

### Current Implementation
- `config.ts`: Core constants for validation and storage
- Constants used in `storage.ts` and `validation.ts`
- Simple flat structure suitable for current project size

### Future Considerations
For project growth:
- Move to `/config` directory structure
- Split into domain-specific files
- Add environment-specific configs
- Implement feature flags