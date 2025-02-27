import React, { useState } from 'react';
import { Box, TextField, Chip, Typography, IconButton, TableRow, TableCell } from '@mui/material';
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
    <TableRow>
      {isEditing ? (
        <>
          <TableCell size="small" sx={{ width: 'auto', whiteSpace: 'nowrap' }}>
            <TextField
              fullWidth
              size="small"
              value={localShortcut}
              onChange={handleShortcutChange}
              placeholder="Shortcut"
            // sx={{ my: 0.5 }} // Add small vertical margin
            />
          </TableCell>
          <TableCell>
            <TextField
              fullWidth
              size="small"
              value={localDescription}
              onChange={handleDescriptionChange}
              placeholder="Description"
            />
          </TableCell>
          <TableCell padding="none">
            <IconButton
              onClick={onDelete}
              color="error"
              size="small"
              sx={{
                padding: '0px',
                '& .MuiSvgIcon-root': {
                  fontSize: '16px'
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </>
      ) : (
        <>
          <TableCell
            size="small"
            sx={{
              bgcolor: 'grey.100',
              borderRadius: 1,
              whiteSpace: "nowrap", width: "auto"
            }}>
            <Typography
              component="kbd"
              sx={{
                fontFamily: 'JetBrains Mono, Consolas, monospace'
              }}
            >
              {shortcut}
            </Typography>
          </TableCell>
          <TableCell sx={{ width: '100%' }}>
            <Typography color="text.secondary">
              {description}
            </Typography>
          </TableCell>
          <TableCell padding="none" style={{ width: '0' }} />
        </>
      )}
    </TableRow>
  );
};

export default Item;