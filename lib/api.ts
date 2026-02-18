import Note from "@/types/note";
import axios, { Axios, AxiosResponse } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NOTEHUB_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

export async function fetchNotes(
  search: string,
  page: number,
  perPage = 12
): Promise<{ notes: Note[]; totalPages: number }> {
  const response: AxiosResponse<{ notes: Note[]; totalPages: number }> =
    await api.get("/notes", {
      params: {
        search,
        page,
        perPage,
        sortBy: "created",
      },
    });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const responce: AxiosResponse<Note> = await api.get(`/notes/${id}`);
  return responce.data;
}

export async function createNote(
  note: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> {
  const response: AxiosResponse<Note> = await api.post("/notes", note);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const responce: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
  return responce.data
}
