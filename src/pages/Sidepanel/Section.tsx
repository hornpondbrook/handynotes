import React, { useState } from 'react';
import Item from './Item';
import { Section as SectionType } from '../../types';

interface SectionProps {
  section: SectionType;
  sectionIndex: number;
  onSectionUpdate: (index: number, updatedSection: SectionType) => void; // New prop
}

const Section: React.FC<SectionProps> = ({ section, sectionIndex, onSectionUpdate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(section.title);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleEditClick = () => {
    setIsEditing(true);
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
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <div className="section-card">
      <div
        className="section-header"
        onClick={isEditing ? undefined : toggleCollapse}
        title={isCollapsed ? "Click to expand" : "Click to collapse"}
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
        {isEditing ? (
          <div className="edit-actions">
            <span className="save-icon" onClick={handleSaveClick}>
              ✓
            </span>
            <span className="cancel-icon" onClick={handleCancelClick}>
              ✕
            </span>
          </div>
        ) : (
          <span
            className="edit-icon"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick();
            }}
          >
            ✎
          </span>
        )}
      </div>
      {(!isCollapsed || isEditing) && (
        <div
          className="section-content"
        >
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
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default React.memo(Section);