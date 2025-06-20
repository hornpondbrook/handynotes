import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Table, TableBody, TableContainer, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { SectionModel, ItemModel } from '../../types';
import Item from './Item';
import { validateTitle, validateShortcut, validateDescription, ValidationError } from '../../utils/validation';

import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from '@mui/icons-material';


interface SectionProps {
  section: SectionModel;
  index: number;
  isEditing: boolean;
  provided: any;
  onEditing: (sectionId: string) => void;
  onUpdate: (section: SectionModel) => void;
  onDelete: (sectionId: string) => void;
  onSave: (sectionId: string) => void;
  onCancel: (sectionId: string) => void;
}


const Section: React.FC<SectionProps> = ({
  section,
  index,
  isEditing,
  provided,
  onEditing,
  onUpdate,
  onDelete,
  onSave,
  onCancel
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [title, setTitle] = useState(section.title);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [validationErrors, setValidationErrors] = useState<{
    title?: ValidationError[];
    items: { [itemId: string]: ValidationError[] };
  }>({
    items: {}
  });
  const [showValidation, setShowValidation] = useState(false);

  // console.log(`${Date.now()} SECTION ${section.id} rendering`);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCollapsed(false);
    onEditing(section.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    onDelete(section.id);
  };
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleSaveClick = () => {
    const titleErrors = validateTitle(title);
    const seenShortcuts = new Map<string, number>();

    const itemValidations: { [itemId: string]: ValidationError[] } = {};

    section.items.forEach((item, index) => {
      const errors: ValidationError[] = [];
      const normalizedShortcut = item.shortcut.toLowerCase();

      // Basic validation
      errors.push(...validateShortcut(item.shortcut));
      errors.push(...validateDescription(item.description));

      // Duplicate check
      if (seenShortcuts.has(normalizedShortcut)) {
        errors.push({
          field: 'shortcut',
          message: `Shortcut is a duplicate of item at position ${seenShortcuts.get(normalizedShortcut)! + 1}`
        });
      } else {
        seenShortcuts.set(normalizedShortcut, index);
      }

      if (errors.length > 0) {
        itemValidations[item.id] = errors;
      }
    });

    const newValidationState = {
      title: titleErrors.length > 0 ? titleErrors : undefined,
      items: itemValidations
    };

    setValidationErrors(newValidationState);
    setShowValidation(true);

    // Only save if no errors
    const hasErrors = titleErrors.length > 0 || Object.keys(itemValidations).length > 0;
    if (!hasErrors) {
      onSave(section.id);
    }
  };

  const handleCancelClick = () => {
    setValidationErrors({ items: {} });
    setShowValidation(false);
    onCancel(section.id);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    onUpdate({ ...section, title: value });
  };
  const handleItemUpdate = (updatedItem: ItemModel) => {
    onUpdate({
      ...section,
      items: section.items.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      )
    });
  };

  const handleItemDelete = (itemId: string) => {
    onUpdate({
      ...section,
      items: section.items.filter(item => item.id !== itemId)
    });
  };

  const handleItemAdd = () => {
    const newItem: ItemModel = {
      id: `item-${Date.now()}`,
      shortcut: '',
      description: ''
    };
    onUpdate({
      ...section,
      items: [...section.items, newItem]
    });
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: 1,
          marginBottom: 1,
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
            padding: '1px 6px',
            backgroundColor: 'grey.200',
            borderBottom: '1px solid',
            borderColor: 'divider',
            cursor: isEditing ? 'default' : 'pointer',
            '&:hover': {
              backgroundColor: 'grey.300'
            }
          }}
          {...provided.dragHandleProps}
          onClick={isEditing ? undefined : toggleCollapse}
        >
          {isEditing ? (
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={title}
              onChange={handleTitleChange}
              error={showValidation && !!validationErrors.title}
              helperText={showValidation && validationErrors.title?.[0]?.message}
              sx={{
                marginRight: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.paper'
                }
              }}
            />
          ) : (
            <Typography variant="h6" component="h2">
              {section.title}
            </Typography>
          )}
          <Box sx={{
            display: 'flex',
            gap: 0.5,
            opacity: isEditing ? 1 : 0, // Always visible in edit mode
            transition: 'opacity 0.2s ease',
            '&:hover': {
              opacity: 1
            }
          }}>
            {isEditing ? (
              <>
                <IconButton
                  aria-label="save"
                  onClick={handleSaveClick}
                  sx={{ '& svg': { fontSize: 20 } }}>
                  <SaveIcon />
                </IconButton>
                <IconButton
                  aria-label="cancel"
                  onClick={handleCancelClick}
                  color="error" sx={{ '& svg': { fontSize: 20 } }}>
                  <CloseIcon />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  aria-label="edit"
                  onClick={handleEditClick}
                  color="primary" sx={{ '& svg': { fontSize: 20 } }}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={handleDeleteClick}
                  color="error" sx={{ '& svg': { fontSize: 20 } }}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Box>

        {!isCollapsed && (
          <Box sx={{ padding: 0 }}>
            <TableContainer sx={{ mb: 4 }}>
              <Table size="small" sx={{ width: "100%", tableLayout: "auto" }}>
                <TableBody>
                  {section.items.map((item, index) => {
                    return (
                      <Item
                        key={`${section.id}-${item.id}`}
                        item={item}
                        isEditing={isEditing}
                        validationErrors={showValidation ? validationErrors.items[item.id] : []}
                        onUpdate={handleItemUpdate}
                        onDelete={() => handleItemDelete(item.id)}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            {isEditing && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleItemAdd}
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
            <Button
              aria-label="cancel"
              onClick={handleDeleteCancel}
              color="primary">
              Cancel
            </Button>
            <Button
              aria-label="confirm"
              onClick={handleDeleteConfirm}
              color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default Section;