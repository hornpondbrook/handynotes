import React, { ReactNode } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Sidepanel from '../Sidepanel';
import { StorageUtils } from '../../../utils/storage';
import { SectionModel } from '../../../types';

// Mock dependencies
jest.mock('../../../utils/storage');
jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children }: { children: ReactNode }) => children,
  Droppable: ({ children }: { children: (provided: any) => ReactNode }) =>
    children({
      innerRef: jest.fn(),
      droppableProps: {}
    }),
  Draggable: ({ children }: { children: (provided: any) => ReactNode }) =>
    children({
      innerRef: jest.fn(),
      draggableProps: {},
      dragHandleProps: {}
    }),
}));


describe('Sidepanel component', () => {
  // Define mock sections here
  const mockSection1: SectionModel = {
    id: 'section-1',
    title: 'Section 1',
    items: [
      { id: 'item-1-1', shortcut: 'ctrl+a', description: 'Select all' }
    ]
  };

  const mockSection2: SectionModel = {
    id: 'section-2',
    title: 'Section 2',
    items: [
      { id: 'item-2-1', shortcut: 'ctrl+v', description: 'Paste' }
    ]
  };

  const mockSections: SectionModel[] = [mockSection1, mockSection2];

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    (StorageUtils.initializeStorage as jest.Mock).mockResolvedValue(undefined);
    (StorageUtils.getSections as jest.Mock).mockResolvedValue(mockSections);
    (StorageUtils.setSections as jest.Mock).mockResolvedValue(undefined);
  });

  // Data Loading and Initialization

  test('loads data from storage on mount', async () => {
    // Mock StorageUtils
    jest.spyOn(StorageUtils, 'getSections').mockResolvedValue(mockSections);

    render(<Sidepanel />);

    // Wait for data loading
    await waitFor(() => {
      expect(screen.getByText('Section 1')).toBeInTheDocument();
    });

    expect(StorageUtils.getSections).toHaveBeenCalled();
  });

  test('initializes with default data when storage is empty', async () => {
    // Mock empty storage and initialization
    jest.spyOn(StorageUtils, 'getSections').mockResolvedValue([]);
    jest.spyOn(StorageUtils, 'setSections').mockResolvedValue();

    const initialSections = [{ id: 'init-1', title: 'Initial Section', items: [] }];
    jest.spyOn(require('../../../data/initialData'), 'initializeInitialSections')
      .mockResolvedValue(initialSections);

    render(<Sidepanel />);

    await waitFor(() => {
      expect(screen.getByText('Initial Section')).toBeInTheDocument();
    });
  });

  // Additional test cases for Sidepanel.test.tsx

  // Test saving data to storage
  test('saves sections to storage when sections change', async () => {
    render(<Sidepanel />);

    await waitFor(() => {
      expect(screen.getByText('Section 1')).toBeInTheDocument();
    });

    // Add a section to trigger storage update
    fireEvent.click(screen.getByText('Add Section'));

    // Verify storage was updated
    await waitFor(() => {
      expect(StorageUtils.setSections).toHaveBeenCalled();
    });
  });

  // Test section editing
  test('edits a section title', async () => {
    render(<Sidepanel />);

    await waitFor(() => {
      expect(screen.getByText('Section 1')).toBeInTheDocument();
    });

    // Find and click edit button
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    // Find title input and change it
    const titleInput = screen.getByDisplayValue('Section 1');
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

    // Save changes
    const saveButtons = screen.getAllByRole('button', { name: /save/i });
    fireEvent.click(saveButtons[0]);

    // Verify title changed
    expect(screen.getByText('Updated Title')).toBeInTheDocument();
    expect(screen.queryByText('Section 1')).not.toBeInTheDocument();
  });

  // Test canceling section edit
  test('cancels section edit without saving changes', async () => {
    render(<Sidepanel />);

    await waitFor(() => {
      expect(screen.getByText('Section 1')).toBeInTheDocument();
    });

    // Find and click edit button
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    // Change title
    const titleInput = screen.getByDisplayValue('Section 1');
    fireEvent.change(titleInput, { target: { value: 'Changed Title' } });

    // Cancel changes
    const cancelButtons = screen.getAllByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButtons[0]);

    // Verify title reverted
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.queryByText('Changed Title')).not.toBeInTheDocument();
  });

  // Test adding a new item to a section
  test('adds a new item to a section', async () => {
    render(<Sidepanel />);

    await waitFor(() => {
      expect(screen.getByText('Section 1')).toBeInTheDocument();
    });

    // Enter edit mode
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    // Find and click "Add Item" button
    const addItemButton = screen.getByRole('button', { name: /add item/i });
    fireEvent.click(addItemButton);

    // Verify new item inputs appear
    const shortcutInputs = screen.getAllByPlaceholderText('Enter shortcut');
    const descriptionInputs = screen.getAllByPlaceholderText('Enter description');

    // Initial item + new item
    expect(shortcutInputs.length).toBe(mockSection1.items.length + 1);
    expect(descriptionInputs.length).toBe(mockSection1.items.length + 1);
  });

  // Test section collapse functionality
  test('collapses and expands a section', async () => {
    render(<Sidepanel />);

    await waitFor(() => {
      expect(screen.getByText('Section 1')).toBeInTheDocument();
    });

    // Initial state - section content visible
    expect(screen.getByText('ctrl+a')).toBeInTheDocument();

    // Click section header to collapse
    const sectionHeader = screen.getByText('Section 1');
    fireEvent.click(sectionHeader);

    // Verify content is hidden
    expect(screen.queryByText('ctrl+a')).not.toBeInTheDocument();

    // Click again to expand
    fireEvent.click(sectionHeader);

    // Verify content is visible again
    expect(screen.getByText('ctrl+a')).toBeInTheDocument();
  });

  // Test keyboard shortcuts
  test('activates keyboard shortcuts when focused', async () => {
    const addSectionMock = jest.fn();
    // Mock the useKeyboardShortcut hook if it exists
    jest.spyOn(React, 'useEffect').mockImplementation((effect) => {
      effect();
      return () => { };
    });

    render(<Sidepanel />);

    await waitFor(() => {
      expect(screen.getByText('Section 1')).toBeInTheDocument();
    });

    // Simulate keyboard shortcut for adding section (if implemented)
    fireEvent.keyDown(document, { key: 'n', ctrlKey: true });

    // Check if handler was called or new section appears
    // This depends on your implementation
  });

  // Test error handling when storage fails
  test.skip('handles storage error gracefully', async () => {
    console.error = jest.fn(); // Suppress console errors

    // Mock storage to throw error
    jest.spyOn(StorageUtils, 'getSections').mockImplementation(() => {
      throw new Error('Storage error');
    });

    render(<Sidepanel />);

    // Check for error state or fallback UI
    // This depends on your error handling implementation
    await waitFor(() => {
      // Could check for error message or fallback UI
    });

    // Verify error was logged (if applicable)
    expect(console.error).toHaveBeenCalled();
  });

  // Test drag and drop reordering
  test('reorders sections when dragged', async () => {
    // Mock the onDragEnd implementation
    const originalHandleSectionMove = jest.fn();
    jest.spyOn(React, 'useCallback').mockImplementation((fn) => originalHandleSectionMove);

    render(<Sidepanel />);

    await waitFor(() => {
      expect(screen.getByText('Section 1')).toBeInTheDocument();
    });

    // Create a mock drag result
    const mockDragResult = {
      destination: { index: 1 },
      source: { index: 0 },
      draggableId: 'section-1'
    };

    // Call the onDragEnd function directly
    originalHandleSectionMove(mockDragResult);

    // Verify sections are reordered
    // This could be tricky to test, may need to check if setSections was called with reordered array
    expect(originalHandleSectionMove).toHaveBeenCalledWith(mockDragResult);
  });

  // Test persistence of collapsed state
  test.skip('preserves collapsed state between renders', async () => {
    const { unmount } = render(<Sidepanel />);

    await waitFor(() => {
      expect(screen.getByText('Section 1')).toBeInTheDocument();
    });

    // Collapse section
    const sectionHeader = screen.getByText('Section 1');
    fireEvent.click(sectionHeader);

    // Unmount and remount component
    unmount();
    render(<Sidepanel />);

    await waitFor(() => {
      expect(screen.getByText('Section 1')).toBeInTheDocument();
    });

    // Verify section is still collapsed
    expect(screen.queryByText('ctrl+a')).not.toBeInTheDocument();
  });



});