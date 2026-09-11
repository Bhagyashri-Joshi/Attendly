import { apiClient } from "./apiClient";
import type { User } from "@/types/auth";
type ProfileResponse={success:boolean;message?:string;data:{user:User}};
export const getProfile=()=>apiClient.get<ProfileResponse>("/api/profile");
export const updateProfile=(data:{name?:string;profileImage?:string|null})=>apiClient.put<ProfileResponse>("/api/profile",data);
