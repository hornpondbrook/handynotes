import { AddBox as AddBoxIcon } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import theme from '../../theme';
import { StorageUtils } from '../../utils/storage';
import { initializeInitialSections } from '../../data/initialData';
import { SectionsModel, SectionModel } from '../../types';
import Section from './Section';


const Sidepanel: React.FC = () => {
  const [sections, setSections] = useState<SectionsModel>([]);
  const [preSection, setPreSection] = useState<{ index: number, section: SectionModel | null } | null>(null);

  console.log(`${Date.now()} SIDEPANEL rendering ${sections.length} sections`);

  // Add effect to load data from storage
  useEffect(() => {
    const loadData = async () => {
      await StorageUtils.initializeStorage();
      let data = await StorageUtils.getSections();
      console.log(`${Date.now()} STORAGE loaded ${data.length} sections`);
      if (data.length === 0) {
        data = await initializeInitialSections();
        await StorageUtils.setSections(data);
      }
      setSections(data);
    };
    loadData();
  }, []);

  // Add effect to handle storage updates
  // useEffect(() => {
  //   console.log(`${Date.now()} STORAGE updates ${sections.length} sections`);
  //   StorageUtils.setSections(sections);
  // }, [sections]);

  // Add unload effect
  useEffect(() => {
    const handleUnload = () => {
      StorageUtils.setSections(sections);
    };

    // Call handleUnload on page refresh or exit
    // console.log(`${Date.now()} SESSION updated ${JSON.stringify(sections)}`);
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      // Save on unmount as well
      handleUnload();
    };
  }, [sections]);

  const handleSectionMove = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const sectionArray = Array.from(sections);
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const [reorderedItem] = sectionArray.splice(sourceIndex, 1);
    sectionArray.splice(destinationIndex, 0, reorderedItem);

    setSections(sectionArray);
  };

  const handleSectionAdd = () => {
    const newSection: SectionModel = {
      id: `s${Date.now()}`,
      title: 'New Section',
      items: [{ id: `i${Date.now()}`, shortcut: '', description: '' }]
    };

    // Use functional update pattern to ensure we're working with latest state
    setSections(prevSections => {
      const updatedSections = [...prevSections, newSection];

      // Set preSection with the correct index
      setPreSection({
        index: updatedSections.length - 1,
        section: null
      });

      console.log(`${Date.now()} ADD Section to ${updatedSections}`);

      return updatedSections;
    });
  };

  const handleSectionUpdate = (updatedSection: SectionModel) => {
    const newSections = sections.map(s => {
      if (s.id === updatedSection.id) {
        return { ...s, ...updatedSection };
      }
      return s;
    });
    setSections(newSections);
  }

  const handleSectionEditStart = (id: string) => {
    const section = sections.find(s => s.id === id);
    if (section) {
      setPreSection({
        index: sections.findIndex(s => s.id === id),
        section: JSON.parse(JSON.stringify(section))
      });
    }
  };

  const handleSectionEditSave = (id: string) => {
    // Reset sections to trigger save to storage
    setSections([...sections]);
    setPreSection(null);
  };

  const handleSectionEditCancel = (id: string) => {
    if (!preSection) return;
    const newSections = [...sections];
    if (preSection.section) {
      newSections[preSection.index] = preSection.section;
    } else {
      newSections.splice(preSection.index, 1);
    }
    setSections(newSections);
    setPreSection(null);
  };

  const handleSectionDelete = (id: string) => {
    console.log(`${Date.now()} DELETE section ${id}`);
    // console.log(`${Date.now()} DELETE before ${sections.length} sections`);
    const newSections = sections.filter(s => s.id !== id);
    // console.log(`${Date.now()} DELETE after ${newSections.length} sections`);
    setSections(newSections);
  };


  return (

    <ThemeProvider theme={theme}>
      <DragDropContext onDragEnd={handleSectionMove}>
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
                <Draggable key={section.id} draggableId={section.id} index={index}>
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
                        // key={section.id}
                        section={section}
                        index={index}
                        isEditing={preSection?.index === index}
                        provided={provided} // Pass provided prop
                        onEditing={handleSectionEditStart}
                        onUpdate={handleSectionUpdate}
                        onDelete={handleSectionDelete}
                        onSave={handleSectionEditSave}
                        onCancel={handleSectionEditCancel}
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
