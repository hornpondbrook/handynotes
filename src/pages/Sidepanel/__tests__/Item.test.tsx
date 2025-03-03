import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Item from '../Item';
import { ItemModel } from '../../../types';

describe('Item component', () => {
  const mockItem: ItemModel = {
    id: 'test-1',
    shortcut: 'ctrl+t',
    description: 'test description'
  };

  const mockProps = {
    item: mockItem,
    isEditing: false,
    onUpdate: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderItem = (props = mockProps) => {
    return render(
      <table>
        <tbody>
          <Item {...props} />
        </tbody>
      </table>
    );
  };

  test('renders in view mode', () => {
    renderItem();
    expect(screen.getByText('ctrl+t')).toBeInTheDocument();
    expect(screen.getByText('test description')).toBeInTheDocument();
  });

  test('displays initial values in edit mode', () => {
    renderItem({ ...mockProps, isEditing: true });
    expect(screen.getByDisplayValue('ctrl+t')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test description')).toBeInTheDocument();
  });

  test('shows placeholder values in edit mode', () => {
    renderItem({ ...mockProps, isEditing: true });
    expect(screen.getByPlaceholderText('Enter shortcut')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
  });

  test('calls onUpdate with updated shortcut', () => {
    renderItem({ ...mockProps, isEditing: true });
    const shortcutInput = screen.getByPlaceholderText('Enter shortcut');
    fireEvent.change(shortcutInput, { target: { value: 'new+shortcut' } });
    expect(mockProps.onUpdate).toHaveBeenCalledWith({
      ...mockItem,
      shortcut: 'new+shortcut'
    });
  });

  test('calls onUpdate with updated description', () => {
    renderItem({ ...mockProps, isEditing: true });
    const descriptionInput = screen.getByPlaceholderText('Enter description');
    fireEvent.change(descriptionInput, { target: { value: 'new description' } });
    expect(mockProps.onUpdate).toHaveBeenCalledWith({
      ...mockItem,
      description: 'new description'
    });
  });

  test('does not render delete button in view mode', () => {
    renderItem({ ...mockProps, isEditing: false });
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });

  test('renders delete button in edit mode', () => {
    renderItem({ ...mockProps, isEditing: true });
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  test('calls onDelete when delete button clicked', () => {
    renderItem({ ...mockProps, isEditing: true });
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    expect(mockProps.onDelete).toHaveBeenCalled();
  });
});