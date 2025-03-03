import { Delete as DeleteIcon } from '@mui/icons-material';
import { IconButton, TableCell, TableRow, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { ItemModel } from '../../types';

interface ItemProps {
  item: ItemModel;
  isEditing: boolean;
  onUpdate: (item: ItemModel) => void;
  onDelete: () => void;
}

const Item: React.FC<ItemProps> = ({ item, isEditing, onUpdate, onDelete }) => {

  const [localShortcut, setLocalShortcut] = useState(item.shortcut);
  const [localDescription, setLocalDescription] = useState(item.description);

  const handleShortcutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalShortcut(e.target.value);
    onUpdate({ ...item, shortcut: e.target.value });
  };
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalDescription(e.target.value);
    onUpdate({ ...item, description: e.target.value });
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
              placeholder="Enter shortcut" // Add placeholder
              sx={{
                '& .MuiInputBase-input::placeholder': {
                  opacity: 0.7,
                  fontStyle: 'italic'
                }
              }}
            />
          </TableCell>
          <TableCell>
            <TextField
              fullWidth
              size="small"
              value={localDescription}
              onChange={handleDescriptionChange}
              placeholder="Enter description" // Add placeholder
              sx={{
                '& .MuiInputBase-input::placeholder': {
                  opacity: 0.7,
                  fontStyle: 'italic'
                }
              }}
            />
          </TableCell>
          <TableCell padding="none">
            <IconButton
              aria-label="delete"
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
              whiteSpace: "nowrap", width: "auto",
              paddingRight: 2,
            }}>
            <Typography
              component="kbd"
              sx={{
                fontFamily: 'JetBrains Mono, Consolas, monospace'
              }}
            >
              {item.shortcut || "No shortcut"} {/* Show default if empty */}
            </Typography>
          </TableCell>
          <TableCell sx={{
            width: '100%',
            paddingLeft: 2,
          }}>
            <Typography color="text.secondary">
              {item.description || "No description"} {/* Show default if empty */}
            </Typography>
          </TableCell>
          <TableCell padding="none" style={{ width: '0' }} />
        </>
      )}
    </TableRow>
  );
};

export default Item;

