import { AddBox as AddBoxIcon } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { initializeInitialSections } from '../../data/initialData';
import theme from '../../theme';
import { Sections, Section as SectionType } from '../../types';
import { StorageUtils } from '../../utils/storage';
import Section from './Section';

interface SidepanelState {
  sections: Sections;
  pendingSection: SectionType | null;
}

const Sidepanel: React.FC = () => {
  const [state, setState] = useState<SidepanelState>({
    sections: [],
    pendingSection: null
  });
  const [sections, setSections] = useState<Sections>([]);

  const handleSectionIndexChange = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = Array.from(sections);
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);

    setSections(items);
    StorageUtils.setSections(items);
  };
  const handleSectionUpdate = (index: number, updatedSection: SectionType) => {
    console.log("handleSectionUpdate called", index, updatedSection);
    console.log("sections before update", sections);
    const newSections = [...sections];
    newSections[index] = {
      ...updatedSection,
      items: updatedSection.items.map(item => ({ ...item }))
    };
    console.log("sections after update", newSections);
    setSections(newSections);
    StorageUtils.setSections(newSections);
  };
  const handleSectionAdd = () => {
    const newSection: SectionType = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      items: [{
        id: `item-${Date.now()}`,
        shortcut: '',
        description: ''
      }],
      isNew: true // Add this flag
    };

    setSections([...sections, newSection]);
    StorageUtils.setSections([...sections, newSection]);
  };
  const handleSectionSave = (index: number, updatedSection: SectionType) => {
    const savedSection = {
      ...updatedSection,
      isNew: false // Reset isNew flag when saving
    };

    if (state.pendingSection?.id === updatedSection.id) {
      setState(prev => ({
        sections: [...prev.sections, savedSection],
        pendingSection: null
      }));
      StorageUtils.setSections([...state.sections, savedSection]);
    } else {
      handleSectionUpdate(index, savedSection);
    }
  };
  const handleSectionCancel = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section?.isNew) {
      const newSections = sections.filter(s => s.id !== sectionId);
      setSections(newSections);
      StorageUtils.setSections(newSections);
    }
  };
  const handleSectionDelete = (sectionId: string) => {
    const newSections = sections.filter(s => s.id !== sectionId);
    setSections(newSections);
    StorageUtils.setSections(newSections);
  };
  useEffect(() => {
    const loadData = async () => {
      await StorageUtils.initializeStorage();
      let data = await StorageUtils.getSections();
      if (data.length === 0) {
        data = await initializeInitialSections();
        await StorageUtils.setSections(data);
      }
      setSections(data);
    };
    loadData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <DragDropContext onDragEnd={handleSectionIndexChange}>
        <Droppable droppableId="sections">
          {(provided) => (
            <Box
              sx={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                padding: 2,
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                boxSizing: 'border-box'
              }}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {sections.map((section, index) => (
                <Draggable key={section.id} draggableId={`${section.id}-${index}`} index={index}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      // {...provided.dragHandleProps}
                      sx={{
                        border: 'none',
                        backgroundColor: 'transparent'
                      }}
                    >
                      <Section
                        key={section.id}
                        section={section}
                        sectionIndex={index}
                        onSectionUpdate={handleSectionSave}
                        onCancel={() => handleSectionCancel(section.id)}
                        onDelete={handleSectionDelete}
                        provided={provided} // Pass provided prop
                        initialEditMode={section.isNew} // Changed from title check to isNew flag
                      />
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <Button
                variant="outlined"
                startIcon={<AddBoxIcon />}
                onClick={handleSectionAdd}
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
                Add Section
              </Button>
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </ThemeProvider>
  );
};

export default Sidepanel;