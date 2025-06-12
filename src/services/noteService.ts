import type { Note, CreateNote } from "../types/note";
import axios from "axios";

const API_URL = 'https://notehub-public.goit.study/api/notes';
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

interface FetchNotes {
    notes: Note[];
    totalPages: number;
}
interface FetchParams {
  search?: string;
  page?: number;
  perPage?: number;
}

 export async function fetchNotes(  
  searchText: string,
  page: number,
  perPage: number = 12
): Promise<FetchNotes> {
   const params: FetchParams = {
    ...(searchText.trim() !== "" && {search: searchText.trim()}),
    page,
    perPage,
  };

  const res = await axiosInstance.get<FetchNotes>("/", { params });
 return res.data;
 };


 export async function createNote(newNote: CreateNote): Promise<Note> {
    const res = await axiosInstance.post<Note>("/" , newNote);
    return res.data;
 }

 export async function deleteNote (noteId: number): Promise<Note> {
    const res = await axiosInstance.delete<Note>(`/${noteId}`);
    return res.data;
 };