import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { attendanceFormSchema, type AttendanceFormValues } from "@/schemas/attendanceSchemas";
import type { Subject } from "@/types/subject";
import { Button } from "@/components/ui/button";

interface P { open:boolean; subjects:Subject[]; date:string; onClose:()=>void; onSubmit:(v:AttendanceFormValues)=>Promise<void>; }

export function ManualAttendanceDialog({open,subjects,date,onClose,onSubmit}:P){
  const f=useForm<AttendanceFormValues>({resolver:zodResolver(attendanceFormSchema),defaultValues:{subjectId:"",date,status:"PRESENT",note:"",priority:"LOW"}});
  const {isSubmitting,errors}=f.formState; const note=f.watch("note")??""; const {reset}=f;
  useEffect(()=>{if(open)reset({subjectId:"",date,status:"PRESENT",note:"",priority:"LOW"})},[open,date,reset]);
  async function submit(values:AttendanceFormValues){await onSubmit(values);reset({subjectId:"",date,status:"PRESENT",note:"",priority:"LOW"});onClose()}
  if(!open)return null;
  return <Dialog open={open} onClose={isSubmitting?()=>undefined:onClose} title="Add Attendance Record">
    <form className="space-y-4" onSubmit={f.handleSubmit(submit)} noValidate aria-busy={isSubmitting}>
      <div><label className="block text-sm font-medium text-forest-dark" htmlFor="manual-subject">Subject</label><select id="manual-subject" disabled={isSubmitting} className="mt-1 w-full rounded-lg border border-border p-2 disabled:opacity-60" {...f.register("subjectId")}><option value="">Select subject</option>{subjects.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>{errors.subjectId&&<p className="mt-1 text-xs text-[#C0392B]">{errors.subjectId.message}</p>}</div>
      <div><label className="block text-sm font-medium text-forest-dark" htmlFor="manual-date">Date</label><input id="manual-date" disabled={isSubmitting} className="mt-1 w-full rounded-lg border border-border p-2 disabled:opacity-60" type="date" {...f.register("date")}/>{errors.date&&<p className="mt-1 text-xs text-[#C0392B]">{errors.date.message}</p>}</div>
      <div><label className="block text-sm font-medium text-forest-dark" htmlFor="manual-status">Status</label><select id="manual-status" disabled={isSubmitting} className="mt-1 w-full rounded-lg border border-border p-2 disabled:opacity-60" {...f.register("status")}><option value="PRESENT">Present</option><option value="ABSENT">Absent</option></select></div>
      <div><label className="block text-sm font-medium text-forest-dark" htmlFor="manual-note">Notes / Task / Announcement <span className="text-muted">(optional)</span></label><textarea id="manual-note" rows={4} disabled={isSubmitting} maxLength={1000} className="mt-1 w-full resize-y rounded-lg border border-border p-2 disabled:opacity-60" placeholder="Add homework, assignment, announcement or reminder" {...f.register("note")}/><p className="mt-1 text-right text-xs text-muted">{note.length}/1000</p>{errors.note&&<p className="text-xs text-[#C0392B]">{errors.note.message}</p>}</div>
      <div><label className="block text-sm font-medium text-forest-dark" htmlFor="manual-priority">Priority</label><select id="manual-priority" disabled={isSubmitting} className="mt-1 w-full rounded-lg border border-border p-2 disabled:opacity-60" {...f.register("priority")}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select></div>
      <div className="flex gap-3 pt-2"><Button type="submit" disabled={isSubmitting} aria-live="polite" className="min-w-[155px]">{isSubmitting?<><Loader2 className="animate-spin" size={17} aria-hidden="true"/><span>Saving...</span><span className="sr-only">Saving attendance, please wait</span></>:"Save Attendance"}</Button><Button type="button" variant="outline" disabled={isSubmitting} onClick={onClose}>Cancel</Button></div>
    </form>
  </Dialog>
}
