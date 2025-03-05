import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Section from '../Section';
import { SectionModel } from '../../../types';

const mockSection: SectionModel = {
  id: 'section-1',
  title: 'Test Section',
  items: [
    { id: 'item-1', shortcut: 'ctrl+a', description: 'Select all' },
    { id: 'item-2', shortcut: 'ctrl+c', description: 'Copy' }
  ]
};

const mockProps = {
  section: mockSection,
  index: 0,
  isEditing: false,
  onEditing: jest.fn(),
  onUpdate: jest.fn(),
  onDelete: jest.fn(),
  onSave: jest.fn(),
  onCancel: jest.fn(),
  provided: {}
};

const renderSection = (props = mockProps) => {
  return render(<Section {...props} />);
};

describe('Section component', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders section title', () => {
    renderSection();
    expect(screen.getByText('Test Section')).toBeInTheDocument();
  });

  test('renders items in view mode', () => {
    renderSection();
    expect(screen.getByText('ctrl+a')).toBeInTheDocument();
    expect(screen.getByText('Select all')).toBeInTheDocument();
    expect(screen.getByText('ctrl+c')).toBeInTheDocument();
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  test('renders items in edit mode', () => {
    renderSection({ ...mockProps, isEditing: true });
    const shortcutInputs = screen.getAllByPlaceholderText('Enter shortcut');
    const descriptionInputs = screen.getAllByPlaceholderText('Enter description');

    expect(shortcutInputs.length).toBe(mockSection.items.length);
    expect(descriptionInputs.length).toBe(mockSection.items.length);
  });

  test('calls onEditing when edit button clicked', () => {
    renderSection();
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    expect(mockProps.onEditing).toHaveBeenCalledWith(mockProps.section.id);
  });

  test('calls onSave when save button clicked', () => {
    renderSection({ ...mockProps, isEditing: true });
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    expect(mockProps.onSave).toHaveBeenCalledWith(mockProps.section.id);
  });

  test('calls onCancel when cancel button clicked', () => {
    renderSection({ ...mockProps, isEditing: true });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(mockProps.onCancel).toHaveBeenCalledWith(mockProps.section.id);
  });

  // test('calls onDelete when delete button clicked', () => {
  //   renderSection();
  //   const deleteButton = screen.getByRole('button', { name: /delete/i });
  //   fireEvent.click(deleteButton);
  //   expect(mockProps.onDelete).toHaveBeenCalledWith(mockProps.section.id);
  // });

  test('calls onDelete when delete button clicked and confirmed', () => {
    renderSection();
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Simulate clicking the confirm button in the dialog
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    expect(mockProps.onDelete).toHaveBeenCalledWith(mockProps.section.id);
  });

  test('does not call onDelete when delete button clicked and canceled', () => {
    renderSection();
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Simulate clicking the cancel button in the dialog
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockProps.onDelete).not.toHaveBeenCalled();
  });

  test('calls onUpdate when item updated', () => {
    renderSection({ ...mockProps, isEditing: true });
    const shortcutInput = screen.getAllByPlaceholderText('Enter shortcut')[0];
    fireEvent.change(shortcutInput, { target: { value: 'new shortcut' } });
    expect(mockProps.onUpdate).toHaveBeenCalledWith({
      ...mockSection,
      items: [
        { id: 'item-1', shortcut: 'new shortcut', description: 'Select all' },
        { id: 'item-2', shortcut: 'ctrl+c', description: 'Copy' }
      ]
    });
  });

  test('renders add item button in edit mode', () => {
    renderSection({ ...mockProps, isEditing: true });
    expect(screen.getByRole('button', { name: /add item/i })).toBeInTheDocument();
  });

  test('calls onUpdate when new item added', () => {
    renderSection({ ...mockProps, isEditing: true });
    const addButton = screen.getByRole('button', { name: /add item/i });
    fireEvent.click(addButton);
    expect(mockProps.onUpdate).toHaveBeenCalledWith({
      ...mockSection,
      items: [
        ...mockSection.items,
        { id: expect.any(String), shortcut: '', description: '' }
      ]
    });
  });
});

describe('Section validation', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows validation errors when saving with empty title', () => {
    renderSection({ ...mockProps, isEditing: true });
    const titleInput = screen.getByDisplayValue('Test Section');
    fireEvent.change(titleInput, { target: { value: '' } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    expect(screen.getByText('Title cannot be empty')).toBeInTheDocument();
    expect(mockProps.onSave).not.toHaveBeenCalled();
  });

  test('shows validation errors when saving with duplicate shortcuts', () => {
    const sectionWithDuplicates = {
      ...mockSection,
      items: [
        { id: 'item-1', shortcut: 'ctrl+a', description: 'First' },
        { id: 'item-2', shortcut: 'ctrl+a', description: 'Second' }
      ]
    };

    renderSection({ ...mockProps, section: sectionWithDuplicates, isEditing: true });
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    expect(screen.getByText('Shortcut is a duplicate of item at position 1')).toBeInTheDocument();
    expect(mockProps.onSave).not.toHaveBeenCalled();
  });

  test('shows no validation errors before save button is clicked', () => {
    renderSection({ ...mockProps, isEditing: true });
    const titleInput = screen.getByDisplayValue('Test Section');
    fireEvent.change(titleInput, { target: { value: '' } });

    expect(screen.queryByText('Title cannot be empty')).not.toBeInTheDocument();
  });

  test('clears validation errors when switching to view mode', () => {
    renderSection({ ...mockProps, isEditing: true });
    const titleInput = screen.getByDisplayValue('Test Section');
    fireEvent.change(titleInput, { target: { value: '' } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(screen.queryByText('Title cannot be empty')).not.toBeInTheDocument();
  });

  test('validates item description length', () => {
    const sectionWithLongDesc = {
      ...mockSection,
      items: [
        { id: 'item-1', shortcut: 'ctrl+a', description: 'a'.repeat(51) }
      ]
    };

    renderSection({ ...mockProps, section: sectionWithLongDesc, isEditing: true });
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    expect(screen.getByText('Description cannot exceed 50 characters')).toBeInTheDocument();
    expect(mockProps.onSave).not.toHaveBeenCalled();
  });

  test('validates shortcut length', () => {
    const sectionWithLongShortcut = {
      ...mockSection,
      items: [
        { id: 'item-1', shortcut: 'a'.repeat(21), description: 'test' }
      ]
    };

    renderSection({ ...mockProps, section: sectionWithLongShortcut, isEditing: true });
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    expect(screen.getByText('Shortcut cannot exceed 20 characters')).toBeInTheDocument();
    expect(mockProps.onSave).not.toHaveBeenCalled();
  });

  test('allows save when all validations pass', () => {
    renderSection({ ...mockProps, isEditing: true });
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(mockProps.onSave).toHaveBeenCalledWith(mockProps.section.id);
  });
});