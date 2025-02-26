import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Sections, Section as SectionType } from '../../types';
import { StorageUtils } from '../../utils/storage';
import { initializeInitialSections } from '../../data/initialData';
import Section from './Section';
import './styles.css';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

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

  console.log("Sidepanel component rendered");

  const onDragEnd = (result: DropResult) => {
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

  const handleAddSection = () => {
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
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="sections">
        {(provided) => (
          <div
            className="sidepanel"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {sections.map((section, index) => (
              <Draggable key={section.id} draggableId={`${section.id}-${index}`} index={index}>
                {(provided) => (
                  <div
                    className="section-card"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Section
                      key={section.id}
                      section={section}
                      sectionIndex={index}
                      onSectionUpdate={handleSectionSave}
                      onCancel={() => handleSectionCancel(section.id)}
                      onDelete={handleSectionDelete}
                      initialEditMode={section.isNew} // Changed from title check to isNew flag
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <button className="add-section-button" onClick={handleAddSection}>
              <span className="material-icons">add_box</span>
              Add Section
            </button>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Sidepanel;