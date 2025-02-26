import React, { useState } from 'react';
import { Box, TextField, Chip, Typography, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

interface ItemProps {
  shortcut: string;
  description: string;
  isEditing: boolean;
  onItemUpdate: (shortcut: string, description: string) => void;
  onDelete: () => void;
}

const Item: React.FC<ItemProps> = ({ shortcut, description, isEditing, onItemUpdate, onDelete }) => {
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
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 0.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-child': {
          borderBottom: 'none'
        }
      }}
    >
      {isEditing ? (
        <>
          <TextField
            variant="outlined"
            size="small"
            value={localShortcut}
            onChange={handleShortcutChange}
            sx={{ width: 120 }}
            placeholder="Shortcut"
          />
          <TextField
            variant="outlined"
            size="small"
            value={localDescription}
            onChange={handleDescriptionChange}
            sx={{ flexGrow: 1 }}
            placeholder="Description"
          />
          <IconButton onClick={onDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 0.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            '&:last-child': {
              borderBottom: 'none'
            }
          }}>
            <Typography
              component="kbd"
              sx={{
                bgcolor: 'grey.100',
                p: '2px 6px',
                borderRadius: 1,
                fontFamily: 'JetBrains Mono, Consolas, monospace',
                fontSize: '0.8rem'
              }}
            >
              {shortcut}
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                flex: 1
              }}
            >
              {description}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Item;