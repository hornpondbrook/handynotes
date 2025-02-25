import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Sections, Section as SectionType } from '../../types';
import { StorageUtils } from '../../utils/storage';
import { initializeInitialSections } from '../../data/initialData';
import Section from './Section';
import './styles.css';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

const Sidepanel: React.FC = () => {
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
                    <Section section={section} index={index} onSectionUpdate={handleSectionUpdate} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Sidepanel;