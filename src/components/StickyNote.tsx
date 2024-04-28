import React from 'react';

interface StickyNoteProps {
  text: string;
}

const StickyNote: React.FC<StickyNoteProps> = ({ text }) => {
  return (
    <div className="bg-yellow-200 p-4 rounded-md shadow-md mb-4">
      <p>{text}</p>
    </div>
  );
};

export default StickyNote;