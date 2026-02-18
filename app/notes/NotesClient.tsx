"use client";

import { useQuery } from "@tanstack/react-query";
import css from "./NotesPage.module.css";
import { fetchNotes } from "@/lib/api";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import SearchBox from "@/components/SearchBox/SearchBox";
import { NoteList } from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import Pagination from "@/components/Pagiation/Pagination";

export default function NotesClient() {
  const [search, setSearch] = useState("");
  const [useInput, setUseInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const debaunceSerch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", search, page],
    queryFn: () => fetchNotes(search, page),
    placeholderData: (prev)=> prev
  });

  const totalPages = data ? data.totalPages : 0;
  const notes = data? data.notes : [];


  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={useInput}
          onSearch={(value) => {
            setUseInput(value);
            debaunceSerch(value);
          }}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            pageCount={totalPages}
            onPageChange={({ selected }) => setPage(selected + 1)}
          />
        )}

        {
          <button className={css.button} onClick={() => setIsModalOpen(true)}>
            Create note +
          </button>
        }
      </header>

      {isLoading && <p>Loading...</p>}

      {isError && <p>Error loading notes</p>}

      {notes.length > 0 && <NoteList notes={notes} />}

      {isModalOpen && (
        <Modal
          onClose={() => {
            setIsModalOpen(false);
          }}
        >
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
