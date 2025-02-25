import React, { useState } from 'react';

interface ItemProps {
  shortcut: string;
  description: string;
  isEditing: boolean;
  onItemUpdate: (shortcut: string, description: string) => void;
}

const Item: React.FC<ItemProps> = ({ shortcut, description, isEditing, onItemUpdate }) => {
  const [localShortcut, setLocalShortcut] = useState(shortcut);
  const [localDescription, setLocalDescription] = useState(description);

  const handleShortcutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalShortcut(e.target.value);
    onItemUpdate(e.target.value, localDescription);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalDescription(e.target.value);
    onItemUpdate(localShortcut, e.target.value);
  };

  return (
    <div className="shortcut-item">
      {isEditing ? (
        <>
          <input
            type="text"
            className="shortcut-input"
            value={localShortcut}
            onChange={handleShortcutChange}
          />
          <input
            type="text"
            className="description-input"
            value={localDescription}
            onChange={handleDescriptionChange}
          />
        </>
      ) : (
        <>
          <kbd className="shortcut">{localShortcut}</kbd>
          <span className="description">{localDescription}</span>
        </>
      )}
    </div>
  );
};

export default Item;