import { create } from "zustand";
import { ApiClientError } from "@/services/apiClient";
import {
  fetchSubjects as fetchSubjectsRequest,
  createSubject as createSubjectRequest,
  updateSubject as updateSubjectRequest,
  deleteSubject as deleteSubjectRequest,
  type SubjectInput,
} from "@/services/subjectService";
import type { Subject } from "@/types/subject";

interface SubjectsState {
  subjects: Subject[];
  isLoading: boolean;
  error: string | null;

  fetchSubjects: () => Promise<void>;
  addSubject: (input: SubjectInput) => Promise<void>;
  editSubject: (id: string, input: SubjectInput) => Promise<void>;
  removeSubject: (id: string) => Promise<void>;
}

function messageFrom(err: unknown) {
  return err instanceof ApiClientError ? err.message : "Something went wrong. Please try again.";
}

/**
 * Subjects always come from the API — this store is a thin,
 * unpersisted cache for the current session, refetched on mount of
 * the subjects page. Mutations optimistically patch the local list
 * from the server's response rather than triggering a full refetch.
 */
export const useSubjectsStore = create<SubjectsState>((set, get) => ({
  subjects: [],
  isLoading: true,
  error: null,

  fetchSubjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetchSubjectsRequest();
      set({ subjects: res.data!.subjects, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: messageFrom(err) });
    }
  },

  addSubject: async (input) => {
    const res = await createSubjectRequest(input);
    set({ subjects: [...get().subjects, res.data!.subject] });
  },

  editSubject: async (id, input) => {
    const res = await updateSubjectRequest(id, input);
    set({
      subjects: get().subjects.map((subject) => (subject.id === id ? res.data!.subject : subject)),
    });
  },

  removeSubject: async (id) => {
    await deleteSubjectRequest(id);
    set({ subjects: get().subjects.filter((subject) => subject.id !== id) });
  },
}));
