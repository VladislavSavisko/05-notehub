import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import NoteModal from '../NoteModal/NoteModal';
import SearchBox from '../SearchBox/SearchBox';
import css from './App.module.css';

export default function App() {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [debouncedSearch] = useDebounce(searchText, 300);

  const notes = useQuery({
    queryKey: ["notes", debouncedSearch, currentPage],
    queryFn: () => fetchNotes(debouncedSearch, currentPage),
    placeholderData: keepPreviousData,
  });

  const totalPages = notes.data?.totalPages ?? 0;

  const handleSearchChange = (newSearch: string): void => {
    setSearchText(newSearch);
    setCurrentPage(1);
  };

  return (
    <div className={css.app}>
      
      <header className={css.toolbar}>
        <SearchBox value={searchText} onSearch={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        )}
        <button 
        className={css.button} 
        onClick={() => setIsModalOpen(true)}
        disabled={isModalOpen}
        >
          Create note +
        </button>
      </header>

      {notes.isLoading && <p>Loading...</p>} 
      {notes.isError && <p>Error loading notes.</p>}
      {!notes.isLoading && !notes.isError && (
        <NoteList notes={notes.data?.notes ?? []}/>
      )}
      
      {isModalOpen && (
        <NoteModal 
        onClose={() => setIsModalOpen(false)}/>      
      )}
    </div>
  );
}