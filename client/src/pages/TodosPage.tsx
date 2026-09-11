import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Plus, Search, TriangleAlert } from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { TodoCard } from "@/components/todos/TodoCard";
import { TodoDialog } from "@/components/todos/TodoDialog";
import { TodoSkeleton } from "@/components/todos/TodoSkeleton";
import { useToast } from "@/components/toast/useToast";
import { useSubjectsStore } from "@/store/subjectsStore";
import * as api from "@/services/todoService";
import type { Todo, TodoPriority, TodoStatus } from "@/types/todo";

const errorMessage=(e:unknown)=>e instanceof Error?e.message:"Something went wrong. Please try again.";
export function TodosPage(){
 const [todos,setTodos]=useState<Todo[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(false),[dialog,setDialog]=useState(false),[editing,setEditing]=useState<Todo|null>(null),[busy,setBusy]=useState<string|null>(null),[status,setStatus]=useState("ALL"),[priority,setPriority]=useState("ALL"),[query,setQuery]=useState("");
 const {subjects,fetchSubjects}=useSubjectsStore(); const {showToast}=useToast();
 const load=async()=>{setLoading(true);setError(false);try{const r=await api.fetchTodos();setTodos(r.todos)}catch{setError(true)}finally{setLoading(false)}};
 useEffect(()=>{void load();void fetchSubjects()},[fetchSubjects]);
 const filtered=useMemo(()=>todos.filter(t=>(status==="ALL"||t.status===status)&&(priority==="ALL"||t.priority===priority)&&t.title.toLowerCase().includes(query.toLowerCase().trim())),[todos,status,priority,query]);
 const stats=useMemo(()=>({total:todos.length,pending:todos.filter(t=>t.status==="PENDING").length,completed:todos.filter(t=>t.status==="COMPLETED").length,high:todos.filter(t=>t.priority==="HIGH").length}),[todos]);
 const openAdd=()=>{setEditing(null);setDialog(true)};
 const submit=async(v:{title:string;priority:TodoPriority;status:TodoStatus;subjectId:string})=>{try{if(editing){const r=await api.updateTodo(editing.id,{title:v.title.trim(),priority:v.priority,status:v.status});setTodos(x=>x.map(t=>t.id===editing.id?r.todo:t));showToast("Task updated successfully.","success")}else{const r=await api.createTodo({title:v.title.trim(),priority:v.priority,subjectId:v.subjectId||undefined});setTodos(x=>[r.todo,...x]);showToast("Task created successfully.","success")}setDialog(false);setEditing(null)}catch(e){showToast(errorMessage(e),"error");throw e}};
 const toggle=async(t:Todo)=>{setBusy(t.id);try{const status=t.status==="PENDING"?"COMPLETED":"PENDING" as TodoStatus;const r=await api.updateTodoStatus(t.id,status);setTodos(x=>x.map(v=>v.id===t.id?r.todo:v));showToast(status==="COMPLETED"?"Task marked complete.":"Task marked pending.","success")}catch(e){showToast(errorMessage(e),"error")}finally{setBusy(null)}};
 const remove=async(t:Todo)=>{if(!window.confirm("Are you sure you want to delete this task?"))return;setBusy(t.id);try{await api.deleteTodo(t.id);setTodos(x=>x.filter(v=>v.id!==t.id));showToast("Task deleted successfully.","success")}catch(e){showToast(errorMessage(e),"error")}finally{setBusy(null)}};
 const cards=[['Total Tasks',stats.total],['Pending',stats.pending],['Completed',stats.completed],['High Priority',stats.high]];
 return <AppLayout><main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="font-display text-3xl text-forest-dark">To-Do List</h1><p className="mt-1 text-muted">Manage your tasks, assignments and lecture notes</p></div><Button onClick={openAdd}><Plus size={18}/>Add Task</Button></div>
 {loading?<div className="mt-8"><TodoSkeleton/></div>:error?<div className="mt-8 rounded-card border border-border bg-white p-10 text-center"><TriangleAlert className="mx-auto text-[#C0392B]"/><p className="mt-3 text-muted">Unable to load your tasks.</p><Button className="mt-4" variant="outline" onClick={load}>Retry</Button></div>:<><section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([label,value])=><div key={String(label)} className="rounded-card border border-border bg-white p-5"><p className="text-sm text-muted">{label}</p><p className="mt-2 font-display text-3xl text-forest-dark">{value}</p></div>)}</section>
 <section className="mt-6 flex flex-col gap-3 rounded-card border border-border bg-white p-4 sm:flex-row"><label className="relative flex-1"><span className="sr-only">Search tasks</span><Search size={17} className="absolute left-3 top-3 text-muted"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tasks" className="h-11 w-full rounded-lg border border-border pl-10 pr-3"/></label><select value={status} onChange={e=>setStatus(e.target.value)} aria-label="Filter by status" className="h-11 rounded-lg border border-border px-3"><option value="ALL">All status</option><option value="PENDING">Pending</option><option value="COMPLETED">Completed</option></select><select value={priority} onChange={e=>setPriority(e.target.value)} aria-label="Filter by priority" className="h-11 rounded-lg border border-border px-3"><option value="ALL">All priorities</option><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select></section>
 <section className="mt-6 space-y-4">{filtered.length?filtered.map(t=><TodoCard key={t.id} todo={t} busy={busy===t.id} onToggle={()=>void toggle(t)} onEdit={()=>{setEditing(t);setDialog(true)}} onDelete={()=>void remove(t)}/>):<div className="rounded-card border border-border bg-white px-6 py-14 text-center"><ClipboardList className="mx-auto text-forest" size={40}/><h2 className="mt-4 font-display text-xl text-forest-dark">No tasks yet</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted">Add a task manually or create one while marking attendance.</p><Button className="mt-5" onClick={openAdd}><Plus size={17}/>Add Task</Button></div>}</section></>}
 <TodoDialog open={dialog} todo={editing} subjects={subjects} onClose={()=>{setDialog(false);setEditing(null)}} onSubmit={submit}/></main></AppLayout>
}
