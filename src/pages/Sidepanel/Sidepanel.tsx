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

const Sidepanel: React.FC = () => {
  const [sections, setSections] = useState<Sections>([]);
  const [preSection, setPreSection] = useState<{ index: number, section: SectionType } | null>(null);


  const handleSectionEdit = (index: number) => {
    const section = sections[index];
    setPreSection({
      index,
      section: JSON.parse(JSON.stringify(section)) // Deep copy
    });
    // console.log('Editing section:', index, section); // Add logging
    console.log('Editing section: preSection=', preSection); // Add logging
  };

  // Add effect to monitor preSection changes
  useEffect(() => {
    console.log('preSection changed:', preSection);
  }, [preSection]);

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
  const handleSectionAdd = () => {
    const newSection: SectionType = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      items: [{
        id: `item-${Date.now()}`,
        shortcut: '',
        description: ''
      }],
    };

    setSections([...sections, newSection]);
    // StorageUtils.setSections([...sections, newSection]);
  };
  const handleSectionSave = (index: number, updatedSection: SectionType) => {
    console.log('Saving section:', updatedSection); // Add logging
    const newSections = [...sections];
    newSections[index] = updatedSection;
    setSections(newSections);
    setPreSection(null);
    StorageUtils.setSections(newSections);
  };

  const handleSectionUpdate = (index: number, updatedSection: SectionType) => {
    console.log('Updating section:', updatedSection); // Add logging
    const newSections = [...sections];
    newSections[index] = updatedSection;
    setSections(newSections);
  }

  const handleSectionCancel = (index: number) => {
    console.log('Cancelling section: preSection=', preSection); // Add logging
    console.log('Cancelling section: index=', index); // Add logging
    console.log('Cancelling section: sections=', sections); // Add logging
    if (!preSection) return;

    const newSections = [...sections];
    if (preSection.section) {
      newSections[index] = preSection.section;
    } else {
      // Remove newly added section
      newSections.splice(index, 1);
    }
    console.log('Cancelling section: newSections=', newSections); // Add logging
    setSections(newSections);
    setPreSection(null);
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

  // Add effect to handle storage updates
  useEffect(() => {
    StorageUtils.setSections(sections);
  }, [sections]);

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
                        onSectionEdit={handleSectionEdit}
                        onSectionUpdate={handleSectionUpdate}
                        onSectionSave={handleSectionSave}
                        onSectionCancel={() => handleSectionCancel(index)}
                        onSectionDelete={handleSectionDelete}
                        provided={provided} // Pass provided prop
                        initialEditMode={preSection !== null && preSection.section.id === section.id}
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