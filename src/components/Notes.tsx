import { useState } from "react";
import Draggable from "react-draggable";
import ButtonNewNote from "./ButtonNewNote";

interface Note {
  id: number;
  title: string;
  content: string;
}

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    { id: 0, title: "", content: "" },
  ]);

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      title: "",
      content: "",
    };
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  const updateNote = (id: number, title: string, content: string) => {
    const updatedNotes = notes.map((note) => {
      if (note.id === id) {
        return { ...note, title, content };
      }
      return note;
    });
    setNotes(updatedNotes);
  };

  const deleteNote = (id: number) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
  };

  return (
    <div className="container mx-auto p-4">
        <ButtonNewNote addNote={addNote} />
      <div className="grid grid-cols-3 gap-4">
        {notes.map((note) => (
          <Draggable key={note.id}>
            <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white cursor-grab hover:bg-white/20">
              <input
                type="text"
                value={note.title}
                placeholder="title"
                onChange={(e) =>
                  updateNote(note.id, e.target.value, note.content)
                }
                className="mb-2 w-full bg-transparent p-4 text-white p-0 px-0 py-0 text-lg font-bold focus:outline-none"
              />
              <textarea
                value={note.content}
                placeholder="text here..."
                onChange={(e) =>
                  updateNote(note.id, note.title, e.target.value)
                }
                className="y-full w-full resize-none border-0  bg-transparent p-4 text-white p-0 px-0 py-0 focus:outline-none"
              />
              <button
                onClick={() => deleteNote(note.id)}
                className="absolute right-0 top-0 rounded bg-transparent px-2 py-1 font-bold text-white hover:bg-red-200"
              >
                x
              </button>
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default NotesPage;
