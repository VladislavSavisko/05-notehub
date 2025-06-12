import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
const queryClient = useQueryClient();

const { mutate, isPending, isError, error } = useMutation({
  mutationFn: (id: number) => deleteNote(id),
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ["notes"]});
  },
})
  
return (
  <>
  {isPending && <p className={css.message}>Deleting note...</p>}
  {isError && (
    <p className={css.error}>Error deleting note: {(error as Error).message}
    </p>
  )}

  <ul className={css.list}>
	  {notes.map((note: Note) => {
      const {id, title, content, tag} = note;
      return (
       <li key={id} className={css.listItem}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{tag}</span>
            <button 
              className={css.button} 
              onClick={() => mutate(id)}
              disabled={isPending}
            >
              Delete
            </button>
          </div>
        </li>
      );
    })}
  </ul>
  </>
  );
};