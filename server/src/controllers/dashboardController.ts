import type { Request, Response } from "express";
import { prisma } from "../config/prisma";

const DAYS=["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
function localDate(){const d=new Date(); const p=(n:number)=>String(n).padStart(2,"0"); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;}
function dayOfWeek(){return DAYS[new Date().getDay()];}

export async function getDashboard(req:Request,res:Response){
 const userId=req.userId as string; const today=localDate(); const todayDate=new Date(`${today}T00:00:00.000Z`);
 const [subjects,records,lectures,todayRecords]=await Promise.all([
  prisma.subject.findMany({where:{userId},orderBy:{name:"asc"}}),
  prisma.attendanceRecord.findMany({where:{userId},select:{subjectId:true,status:true}}),
  prisma.timetableLecture.findMany({where:{userId,dayOfWeek:dayOfWeek()},include:{subject:true},orderBy:{startTime:"asc"}}),
  prisma.attendanceRecord.findMany({where:{userId,date:todayDate},select:{id:true,timetableLectureId:true,status:true}})
 ]);
 const present=records.filter(r=>r.status==="PRESENT").length, absent=records.filter(r=>r.status==="ABSENT").length, total=present+absent;
 const subjectAttendance=subjects.map(s=>{const rs=records.filter(r=>r.subjectId===s.id);const p=rs.filter(r=>r.status==="PRESENT").length,a=rs.filter(r=>r.status==="ABSENT").length,t=p+a;return {subjectId:s.id,subjectName:s.name,subjectCode:s.code,color:s.color,present:p,absent:a,total:t,percentage:t?Math.round(p/t*100):0};});
 const attendanceByLecture=new Map(todayRecords.filter(r=>r.timetableLectureId).map(r=>[r.timetableLectureId,r]));
 const todayLectures=lectures.map(l=>{const r=attendanceByLecture.get(l.id);return {id:l.id,subjectId:l.subjectId,subjectName:l.subject.name,subjectCode:l.subject.code,color:l.subject.color,startTime:l.startTime,endTime:l.endTime,room:l.room,status:r?.status??null,state:r?"Completed":"Upcoming",attendanceId:r?.id??null};});
 res.json({success:true,message:"Dashboard retrieved successfully",data:{overallAttendance:total?Math.round(present/total*100):0,totalLectures:total,presentLectures:present,absentLectures:absent,subjectAttendance,todayLectures}});
}
