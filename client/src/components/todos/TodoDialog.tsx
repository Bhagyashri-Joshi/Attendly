import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Subject } from "@/types/subject";
import type { Todo, TodoPriority, TodoStatus } from "@/types/todo";

type Values={title:string;priority:TodoPriority;status:TodoStatus;subjectId:string};
interface Props{open:boolean;todo?:Todo|null;subjects:Subject[];onClose:()=>void;onSubmit:(values:Values)=>Promise<void>}
export function TodoDialog({open,todo,subjects,onClose,onSubmit}:Props){
 const f=useForm<Values>({defaultValues:{title:"",priority:"LOW",status:"PENDING",subjectId:""}}); const {isSubmitting,errors}=f.formState;
 useEffect(()=>{if(open)f.reset({title:todo?.title??"",priority:todo?.priority??"LOW",status:todo?.status??"PENDING",subjectId:todo?.subjectId??""})},[open,todo,f]);
 if(!open)return null;
 return <Dialog open={open} onClose={isSubmitting?()=>undefined:onClose} title={todo?"Edit Task":"Add Task"}>
   <form className="space-y-4" onSubmit={f.handleSubmit(onSubmit)} noValidate aria-busy={isSubmitting}>
    <div><label htmlFor="todo-title" className="block text-sm font-medium text-forest-dark">Task / Note</label><textarea id="todo-title" rows={4} disabled={isSubmitting} className="mt-1 w-full rounded-lg border border-border p-2" maxLength={1000} {...f.register("title",{required:"Task is required",validate:v=>v.trim().length>0||"Task is required"})}/>{errors.title&&<p className="mt-1 text-xs text-[#C0392B]">{errors.title.message}</p>}</div>
    <div><label htmlFor="todo-priority" className="block text-sm font-medium text-forest-dark">Priority</label><select id="todo-priority" disabled={isSubmitting} className="mt-1 w-full rounded-lg border border-border p-2" {...f.register("priority")}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select></div>
    {todo&&<div><label htmlFor="todo-status" className="block text-sm font-medium text-forest-dark">Status</label><select id="todo-status" disabled={isSubmitting} className="mt-1 w-full rounded-lg border border-border p-2" {...f.register("status")}><option value="PENDING">Pending</option><option value="COMPLETED">Completed</option></select></div>}
    {!todo&&<div><label htmlFor="todo-subject" className="block text-sm font-medium text-forest-dark">Subject <span className="text-muted">(optional)</span></label><select id="todo-subject" disabled={isSubmitting} className="mt-1 w-full rounded-lg border border-border p-2" {...f.register("subjectId")}><option value="">No subject</option>{subjects.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>}
    <div className="flex gap-3 pt-2"><Button type="submit" disabled={isSubmitting}>{isSubmitting?<><Loader2 size={17} className="animate-spin"/>Saving...</>:todo?"Save Changes":"Add Task"}</Button><Button type="button" variant="outline" disabled={isSubmitting} onClick={onClose}>Cancel</Button></div>
   </form>
 </Dialog>
}
