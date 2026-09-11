import type { Subject } from "@/types/subject";
import type { TimetableLecture } from "@/types/timetable";
export type AttendanceStatus="PRESENT"|"ABSENT";
export interface AttendanceRecord {id:string;userId:string;subjectId:string;timetableLectureId:string|null;date:string;status:AttendanceStatus;createdAt:string;updatedAt:string;subject:Subject;timetableLecture:TimetableLecture|null;}
export interface DailyLectureAttendance {lecture:TimetableLecture;attendance:AttendanceRecord|null;status:AttendanceStatus|null;}
