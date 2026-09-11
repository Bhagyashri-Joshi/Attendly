import type { TimetableLecture } from "@/types/timetable";

export interface TimelineSlot {
  startMinutes: number;
  endMinutes: number;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

export function timeToMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(value: number): string {
  const hours = Math.floor(value / 60).toString().padStart(2, "0");
  const minutes = (value % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatTime(value: string): string {
  const minutes = timeToMinutes(value);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${mins.toString().padStart(2, "0")} ${suffix}`;
}

export function calculateDuration(startTime: string, endTime: string): number {
  return Math.max(0, timeToMinutes(endTime) - timeToMinutes(startTime));
}

export function isOverlapping(startA: string, endA: string, startB: string, endB: string): boolean {
  return timeToMinutes(startA) < timeToMinutes(endB) && timeToMinutes(endA) > timeToMinutes(startB);
}

export function getSortedTimeSlots(lectures: TimetableLecture[]): TimelineSlot[] {
  const boundaries = [...new Set(lectures.flatMap((lecture) => [
    timeToMinutes(lecture.startTime),
    timeToMinutes(lecture.endTime),
  ]))].sort((a, b) => a - b);

  return boundaries.slice(0, -1).map((startMinutes, index) => {
    const endMinutes = boundaries[index + 1];
    return {
      startMinutes,
      endMinutes,
      startTime: minutesToTime(startMinutes),
      endTime: minutesToTime(endMinutes),
      durationMinutes: endMinutes - startMinutes,
    };
  });
}
