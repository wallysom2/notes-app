import { useState, useEffect, useCallback } from "react";
import Draggable from "react-draggable";
import { api } from "./../utils/api";
import { useSession } from "next-auth/react";


interface Note {
  id: string;
  title: string;
  content: string;
}

const NotesPage: React.FC = () => {
  const { data: session, status } = useSession();
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

  
  const addNote = useCallback(
    (title: string, content: string) => {
      if (status === "authenticated") {
      createNoteMutation.mutate(
        { title, content },
        {
          onSuccess: (newNote) => {
            setNotes((prevNotes) => [...prevNotes, newNote]);
          },
        },
      );
    } else {
      const newNote = { title, content, id: Math.random().toString() };
      setNotes((prevNotes) => [...prevNotes, newNote]);
    }
  },
    [createNoteMutation],
  );

  const updateNote = useCallback(
    (id: string, title: string, content: string) => {
      if (status === "authenticated") {
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
      } else {
        setNotes(
          notes.map((note) =>
            note.id === id ? { ...note, title, content } : note,
          ),
        );
      }
    },
    [updateNoteMutation, status, notes],
  );

  const deleteNote = useCallback(
    (id: string) => {
      if (status === "authenticated") {
        deleteNoteMutation.mutate(
          { id },
          {
            onSuccess: () => {
              setNotes(notes.filter((note) => note.id !== id));
            },
          },
        );
      } else {
        setNotes(notes.filter((note) => note.id !== id));
      }
    },
    [deleteNoteMutation, status, notes],
  );

  return (
    <div className="container mx-auto p-4">
        <button
          onClick={() => addNote("", "")}
          className=" absolute bottom-10 left-1/2 mb-3 me-3 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
        >
          Add New Note
        </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {notes.map((note) => (
          <Draggable key={note.id} enableUserSelectHack={false}
          >
            <div className="flex max-w-xs cursor-grab flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
              <input
                type="text"
                value={note.title}
                placeholder="title"
                onChange={(e) =>
                  updateNote(note.id, e.target.value, note.content)
                }
                className="mb-2 w-full bg-transparent p-0 p-4 px-0 py-0 text-lg font-bold text-white focus:outline-none notes"
                autoCorrect="off"
                onTouchStart={(e) => e.currentTarget.focus()}
              />
              <textarea
                value={note.content}
                placeholder="text here..."
                onChange={(e) =>
                  updateNote(note.id, note.title, e.target.value)
                }
                className="y-full w-full resize-none border-0  bg-transparent p-0 p-4 px-0 py-0 text-white focus:outline-none"
                autoCorrect="off"
                onTouchStart={(e) => e.currentTarget.focus()}
              />
              <button
                onClick={() => deleteNote(note.id)}
                className="absolute right-0 top-0 rounded bg-transparent px-2 py-1 font-bold text-white hover:bg-red-200"
                onTouchStart={(e) => e.currentTarget.focus()}
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
