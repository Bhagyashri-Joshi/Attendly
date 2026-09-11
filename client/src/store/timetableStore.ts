import { create } from "zustand";
import { ApiClientError } from "@/services/apiClient";
import {
  createTimetableLecture as createTimetableLectureRequest,
  deleteTimetableLecture as deleteTimetableLectureRequest,
  fetchTimetable as fetchTimetableRequest,
  updateTimetableLecture as updateTimetableLectureRequest,
  type TimetableLectureInput,
} from "@/services/timetableService";
import { TIMETABLE_DAYS, type TimetableLecture } from "@/types/timetable";

interface TimetableState {
  lectures: TimetableLecture[];
  isLoading: boolean;
  error: string | null;
  fetchTimetable: () => Promise<void>;
  addLecture: (input: TimetableLectureInput) => Promise<void>;
  editLecture: (id: string, input: TimetableLectureInput) => Promise<void>;
  removeLecture: (id: string) => Promise<void>;
}

const dayOrder = new Map(TIMETABLE_DAYS.map((day, index) => [day, index]));

function sortLectures(lectures: TimetableLecture[]) {
  return [...lectures].sort((a, b) => {
    const dayDiff = (dayOrder.get(a.dayOfWeek) ?? 99) - (dayOrder.get(b.dayOfWeek) ?? 99);
    return dayDiff || a.startTime.localeCompare(b.startTime);
  });
}

function messageFrom(error: unknown) {
  return error instanceof ApiClientError ? error.message : "Something went wrong. Please try again.";
}

export const useTimetableStore = create<TimetableState>((set, get) => ({
  lectures: [],
  isLoading: true,
  error: null,

  fetchTimetable: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchTimetableRequest();
      set({ lectures: sortLectures(response.data!.lectures), isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: messageFrom(error) });
    }
  },

  addLecture: async (input) => {
    const response = await createTimetableLectureRequest(input);
    set({ lectures: sortLectures([...get().lectures, response.data!.lecture]) });
  },

  editLecture: async (id, input) => {
    const response = await updateTimetableLectureRequest(id, input);
    set({
      lectures: sortLectures(
        get().lectures.map((lecture) => (lecture.id === id ? response.data!.lecture : lecture))
      ),
    });
  },

  removeLecture: async (id) => {
    await deleteTimetableLectureRequest(id);
    set({ lectures: get().lectures.filter((lecture) => lecture.id !== id) });
  },
}));
