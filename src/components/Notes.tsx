import { useState, useEffect, useCallback } from "react";
import Draggable from "react-draggable";
import { api } from "./../utils/api";

interface Note {
  id: string;
  title: string;
  content: string;
}

const NotesPage: React.FC = () => {
  const userQuery = api.note.getNotes.useQuery();
  const updateNoteMutation = api.note.updateNote.useMutation();
  const createNoteMutation = api.note.createNote.useMutation();
  const deleteNoteMutation = api.note.deleteNote.useMutation();

  const [notes, setNotes] = useState<Note[]>([]);

  const { data: notesData } = userQuery;

  useEffect(() => {
    if (notesData) {
      setNotes(notesData);
    }
  }, [notesData]);

  const addNote = useCallback((title: string, content: string) => {
    createNoteMutation.mutate(
      { title, content },
      {
        onSuccess: (newNote) => {
          setNotes((prevNotes) => [...prevNotes, newNote]);
        },
      },
    );
  }, [createNoteMutation]);

  const updateNote = (id: string, title: string, content: string) => {
    updateNoteMutation.mutate(
      { id, title, content },
      {
        onSuccess: (updatedNote) => {
          setNotes(
            notes.map((note) =>
              note.id === updatedNote.id ? updatedNote : note,
            ),
          );
        },
      },
    );
  };

  const deleteNote = (id: string) => {
    deleteNoteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          setNotes(notes.filter((note) => note.id !== id));
        },
      },
    );
  };

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => addNote("", "")}
        className="mb-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Add New Note
      </button>
      <div className="grid grid-cols-3 gap-4">
        {notes.map((note) => (
          <Draggable key={note.id}>
            <div className="flex max-w-xs cursor-grab flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
              <input
                type="text"
                value={note.title}
                placeholder="title"
                onChange={(e) =>
                  updateNote(note.id, e.target.value, note.content)
                }
                className="mb-2 w-full bg-transparent p-0 p-4 px-0 py-0 text-lg font-bold text-white focus:outline-none"
              />
              <textarea
                value={note.content}
                placeholder="text here..."
                onChange={(e) =>
                  updateNote(note.id, note.title, e.target.value)
                }
                className="y-full w-full resize-none border-0  bg-transparent p-0 p-4 px-0 py-0 text-white focus:outline-none"
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
