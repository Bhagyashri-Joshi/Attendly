import type { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import type { CreateAttendanceInput, UpdateAttendanceInput } from "../validators/attendanceValidators";
const days=["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"] as const;
const dateOnly=(value:string)=>new Date(`${value}T00:00:00.000Z`);
const dayFor=(value:string): (typeof days)[number] | undefined => {
  const jsDay = dateOnly(value).getUTCDay();
  if (jsDay === 0 || jsDay === 6) return undefined;
  return days[jsDay - 1];
};
async function subject(id:string,userId:string){const x=await prisma.subject.findUnique({where:{id}}); if(!x) throw new ApiError(404,"Subject not found"); if(x.userId!==userId) throw new ApiError(403,"You do not have access to this subject"); return x;}
async function lecture(id:string,userId:string){const x=await prisma.timetableLecture.findUnique({where:{id},include:{subject:true}}); if(!x) throw new ApiError(404,"Lecture not found"); if(x.userId!==userId) throw new ApiError(403,"You do not have access to this lecture"); return x;}
async function record(id:string,userId:string){const x=await prisma.attendanceRecord.findUnique({where:{id},include:{subject:true,timetableLecture:true}}); if(!x) throw new ApiError(404,"Attendance record not found"); if(x.userId!==userId) throw new ApiError(403,"You do not have access to this attendance record"); return x;}
export async function listAttendance(req:Request,res:Response){const w:any={userId:req.userId}; if(typeof req.query.subjectId==='string') w.subjectId=req.query.subjectId; if(typeof req.query.startDate==='string'||typeof req.query.endDate==='string'){w.date={};if(typeof req.query.startDate==='string')w.date.gte=dateOnly(req.query.startDate);if(typeof req.query.endDate==='string')w.date.lte=dateOnly(req.query.endDate)} const records=await prisma.attendanceRecord.findMany({where:w,include:{subject:true,timetableLecture:true},orderBy:[{date:'desc'},{createdAt:'desc'}]});res.json({success:true,message:"Attendance retrieved successfully",data:{records}})}
export async function attendanceByDate(req:Request,res:Response){const date=req.params.date as string;if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw new ApiError(400,"Date must be YYYY-MM-DD");const userId=req.userId as string;const targetDay=dayFor(date);const [lectures,records]=await Promise.all([
  targetDay ? prisma.timetableLecture.findMany({where:{userId,dayOfWeek:targetDay},include:{subject:true},orderBy:{startTime:'asc'}}) : Promise.resolve([]),
  prisma.attendanceRecord.findMany({where:{userId,date:dateOnly(date)},include:{subject:true,timetableLecture:true}})
]);const byLecture=new Map(records.filter(r=>r.timetableLectureId).map(r=>[r.timetableLectureId,r]));res.json({success:true,message:"Daily attendance retrieved successfully",data:{date,lectures:lectures.map(l=>({lecture:l,attendance:byLecture.get(l.id)??null,status:byLecture.get(l.id)?.status??null})),manualRecords:records.filter(r=>!r.timetableLectureId)}})}
export async function createAttendance(req:Request,res:Response){
  const userId=req.userId as string;
  const input=req.body as CreateAttendanceInput;
  const subjectEntity=await subject(input.subjectId,userId);
  if(input.timetableLectureId){
    const l=await lecture(input.timetableLectureId,userId);
    if(l.subjectId!==input.subjectId)throw new ApiError(400,"Lecture does not belong to the selected subject");
  }
  const normalizedNote=input.note?.trim();
  const attendance=await prisma.$transaction(async(tx)=>{
    const attendanceDate=dateOnly(input.date);
    if(input.timetableLectureId){
      const existing=await tx.attendanceRecord.findFirst({where:{userId,timetableLectureId:input.timetableLectureId,date:attendanceDate}});
      if(existing)throw new ApiError(409,"Attendance is already marked for this lecture on this date");
    }else{
      const existing=await tx.attendanceRecord.findFirst({where:{userId,subjectId:input.subjectId,timetableLectureId:null,date:attendanceDate}});
      if(existing)throw new ApiError(409,"Manual attendance already exists for this subject and date");
    }
    const created=await tx.attendanceRecord.create({data:{userId,subjectId:input.subjectId,timetableLectureId:input.timetableLectureId??null,date:attendanceDate,status:input.status},include:{subject:true,timetableLecture:true}});
    if(normalizedNote){
      await tx.todo.create({data:{userId,title:normalizedNote,priority:input.priority??"LOW",status:"PENDING",subjectId:subjectEntity.id,attendanceDate,source:"ATTENDANCE"}});
    }
    return created;
  });
  res.status(201).json({success:true,message:normalizedNote?"Attendance and task saved successfully":"Attendance saved successfully",data:{attendance}})
}
export async function updateAttendance(req:Request,res:Response){const userId=req.userId as string;const existing=await record(req.params.id as string,userId);const input=req.body as UpdateAttendanceInput;const subjectId=input.subjectId??existing.subjectId;await subject(subjectId,userId);const lectureId=input.timetableLectureId===undefined?existing.timetableLectureId:input.timetableLectureId;if(lectureId){const l=await lecture(lectureId,userId);if(l.subjectId!==subjectId)throw new ApiError(400,"Lecture does not belong to the selected subject")}const date=input.date?dateOnly(input.date):existing.date;const duplicate=await prisma.attendanceRecord.findFirst({where:{userId,id:{not:existing.id},subjectId,timetableLectureId:lectureId,date}});if(duplicate)throw new ApiError(409,"Duplicate attendance record");const attendance=await prisma.attendanceRecord.update({where:{id:existing.id},data:{subjectId,timetableLectureId:lectureId,date,status:input.status??existing.status},include:{subject:true,timetableLecture:true}});res.json({success:true,message:"Attendance updated successfully",data:{attendance}})}
export async function deleteAttendance(req:Request,res:Response){const x=await record(req.params.id as string,req.userId as string);await prisma.attendanceRecord.delete({where:{id:x.id}});res.json({success:true,message:"Attendance deleted successfully"})}
