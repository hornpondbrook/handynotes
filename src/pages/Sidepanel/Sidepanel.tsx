import React, { useEffect, useState } from 'react';
import { Sections } from '../../types';
import { StorageUtils } from '../../utils/storage';
import { initializeInitialSections } from '../../data/initialData';
import './styles.css';

const Sidepanel: React.FC = () => {
  const [sections, setSections] = useState<Sections>([]);

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
    <div className="sidepanel">
      <header className="sidepanel-header">
        <h1>HandyNotes</h1>
      </header>
      <main className="sidepanel-content">
        {sections.map((section) => (
          <div key={section.id} className="section-card">
            <h2 className="section-title">{section.title}</h2>
            <div className="section-items">
              {section.items.map((item) => (
                <div key={item.id} className="shortcut-item">
                  <kbd className="shortcut">{item.shortcut}</kbd>
                  <span className="description">{item.description}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Sidepanel;
