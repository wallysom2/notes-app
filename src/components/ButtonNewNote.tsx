interface ButtonNewNoteProps {
  addNote: () => void;
}

const ButtonNewNote: React.FC<ButtonNewNoteProps> = ({ addNote }) => {
  return (
    <button
      onClick={addNote}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 mb-4 bg-blue-500 text-white font-bold py-2 px-4 rounded"
    >
      Criar nova nota
    </button>
  );
};

export default ButtonNewNote;