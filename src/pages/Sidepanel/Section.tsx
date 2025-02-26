import React, { useEffect, useState } from 'react';
import Item from './Item';
import { Section as SectionType } from '../../types';
import { Box, IconButton, TextField, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import {
  Save as SaveIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    onDelete(section.id);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
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
    <>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: 1,
          marginBottom: 2,
          border: 'none',  // Add this to remove default border
          '& .section-controls': {
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            opacity: 0,
            transition: 'opacity 0.2s ease'
          },
          '&:hover .section-controls': {
            opacity: 1
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 8px',
            backgroundColor: 'background.default',
            borderBottom: '1px solid',
            borderColor: 'divider',
            cursor: isEditing ? 'default' : 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
          onClick={isEditing ? undefined : toggleCollapse}
        >
          {isEditing ? (
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={title}
              onChange={handleTitleChange}
              sx={{
                marginRight: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.paper'
                }
              }}
            />
          ) : (
            <Typography variant="h6" component="h2" sx={{ fontSize: '0.875rem', lineHeight: 1.2 }}>
              {section.title}
            </Typography>
          )}
          <Box sx={{
            display: 'flex',
            gap: 0.5,
            opacity: 0,
            transition: 'opacity 0.2s ease',
            '&:hover': {
              opacity: 1
            }
          }}>
            {isEditing ? (
              <>
                <IconButton onClick={handleSaveClick} color="primary" sx={{ '& svg': { fontSize: 20 } }}>
                  <SaveIcon />
                </IconButton>
                <IconButton onClick={handleCancelClick} color="error" sx={{ '& svg': { fontSize: 20 } }}>
                  <CloseIcon />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton onClick={handleEditClick} color="primary" sx={{ '& svg': { fontSize: 20 } }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={handleDeleteClick} color="error" sx={{ '& svg': { fontSize: 20 } }}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Box>

        {!isCollapsed && (
          <Box sx={{ padding: 2 }}>
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
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddItem}
                sx={{
                  margin: 2,
                  borderStyle: 'dashed',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: 'text.primary',
                    color: 'text.primary'
                  }
                }}
              >
                Add Item
              </Button>
            )}
          </Box>
        )}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-dialog-title"
        >
          <DialogTitle id="delete-dialog-title">Delete Section</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this section? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default React.memo(Section);