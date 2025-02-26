import React, { useEffect, useState } from 'react';
import Item from './Item';
import { Section as SectionType } from '../../types';

interface SectionProps {
  section: SectionType;
  sectionIndex: number;
  onSectionUpdate: (index: number, updatedSection: SectionType) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  initialEditMode?: boolean;
}

const Section: React.FC<SectionProps> = ({
  section,
  sectionIndex,
  onSectionUpdate,
  onCancel,
  onDelete,  // Add onDelete to destructured props
  initialEditMode = false
}) => {
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [title, setTitle] = useState(section.title);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setIsCollapsed(false); // Always expand when entering edit mode
  }

  const handleSaveClick = () => {
    setIsEditing(false);
    // Update the section title
    const updatedSection = { ...section, title: title };
    onSectionUpdate(sectionIndex, updatedSection);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setTitle(section.title);
    onCancel(); // Call the onCancel prop
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleAddItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      shortcut: '',
      description: ''
    };
    const updatedSection = {
      ...section,
      items: [...section.items, newItem]
    };
    onSectionUpdate(sectionIndex, updatedSection);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent collapse toggle
    if (window.confirm('Are you sure you want to delete this section?')) {
      onDelete(section.id);
    }
  };

  const handleDeleteItem = (itemIndex: number) => {
    const updatedItems = section.items.filter((_, index) => index !== itemIndex);
    const updatedSection = { ...section, items: updatedItems };
    onSectionUpdate(sectionIndex, updatedSection);
  };

  // Also add effect to prevent collapse in edit mode
  useEffect(() => {
    if (isEditing) {
      setIsCollapsed(false);
    }
  }, [isEditing]);

  return (
    <div className="section-card">
      <div
        className="section-header"
        onClick={isEditing ? undefined : toggleCollapse}
      >
        {isEditing ? (
          <input
            type="text"
            className="section-title-input"
            value={title}
            onChange={handleTitleChange}
          />
        ) : (
          <h2>{section.title}</h2>
        )}
        <div className="section-controls">
          {isEditing ? (
            <>
              <span onClick={handleSaveClick} className="control-button material-icons">save</span>
              <span onClick={handleCancelClick} className="control-button material-icons">close</span>
            </>
          ) : (
            <>
              <span onClick={handleEditClick} className="control-button material-icons">edit</span>
              <span onClick={handleDeleteClick} className="control-button material-icons delete-icon">delete</span>
            </>
          )}
        </div>
      </div>
      {!isCollapsed && (
        <div className="section-content">
          {section.items.map((item, index) => {
            const handleItemUpdate = (newShortcut: string, newDescription: string) => {
              const newItems = section.items.map((currentItem, i) => {
                if (i === index) {
                  return { ...currentItem, shortcut: newShortcut, description: newDescription };
                }
                return currentItem;
              });
              const updatedSection = { ...section, items: newItems };
              onSectionUpdate(sectionIndex, updatedSection);
            };
            return (
              <Item
                key={item.id}
                shortcut={item.shortcut}
                description={item.description}
                isEditing={isEditing}
                onItemUpdate={handleItemUpdate}
                onDelete={() => handleDeleteItem(index)} // Add delete handler
              />
            );
          })}
          {isEditing && (
            <button className="add-item-button" onClick={handleAddItem}>
              <span className="material-icons">add</span>
              Add Item
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(Section);