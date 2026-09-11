import type { ReactNode } from "react";
export function EmptyState({title, message, action}:{title:string;message:string;action?:ReactNode}) {return <div className="rounded-2xl border border-border bg-white p-8 text-center"><h2 className="font-display text-xl text-forest-dark">{title}</h2><p className="mt-2 text-sm text-muted">{message}</p>{action&&<div className="mt-4">{action}</div>}</div>}
