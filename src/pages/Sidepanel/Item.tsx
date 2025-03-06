import { Delete as DeleteIcon } from '@mui/icons-material';
import { IconButton, TableCell, TableRow, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { ItemModel } from '../../types';
import { ValidationError } from '../../utils/validation';

interface ItemProps {
  item: ItemModel;
  isEditing: boolean;
  validationErrors?: ValidationError[];
  onUpdate: (item: ItemModel) => void;
  onDelete: () => void
}

const Item: React.FC<ItemProps> = ({
  item,
  isEditing,
  validationErrors = [],
  onUpdate,
  onDelete }) => {

  const [localShortcut, setLocalShortcut] = useState(item.shortcut);
  const [localDescription, setLocalDescription] = useState(item.description);

  const getFieldError = (field: 'shortcut' | 'description') =>
    validationErrors.find(e => e.field === field)?.message;

  const handleShortcutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalShortcut(value);
    onUpdate({ ...item, shortcut: value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalDescription(value);
    onUpdate({ ...item, description: value });
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
              error={!!getFieldError('shortcut')}
              helperText={getFieldError('shortcut')}
              placeholder="Enter shortcut"
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
              error={!!getFieldError('description')}
              helperText={getFieldError('description')}
              placeholder="Enter description"
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
