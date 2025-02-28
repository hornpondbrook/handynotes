import { Delete as DeleteIcon } from '@mui/icons-material';
import { IconButton, TableCell, TableRow, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

interface ItemProps {
  shortcut: string;
  description: string;
  isEditing: boolean;
  onItemUpdate: (shortcut: string, description: string) => void;
  onItemDelete: () => void;
}

const Item: React.FC<ItemProps> = ({ shortcut, description, isEditing, onItemUpdate, onItemDelete }) => {
  console.log('Item render:', { shortcut, description, isEditing });

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
              onClick={onItemDelete}
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
              {shortcut || "No shortcut"} {/* Show default if empty */}
            </Typography>
          </TableCell>
          <TableCell sx={{
            width: '100%',
            paddingLeft: 2,
          }}>
            <Typography color="text.secondary">
              {description || "No description"} {/* Show default if empty */}
            </Typography>
          </TableCell>
          <TableCell padding="none" style={{ width: '0' }} />
        </>
      )}
    </TableRow>
  );
};

export default Item;
// export default React.memo(Item, (prevProps, nextProps) => {
//   return (
//     prevProps.shortcut === nextProps.shortcut &&
//     prevProps.description === nextProps.description &&
//     prevProps.isEditing === nextProps.isEditing
//   );
// });