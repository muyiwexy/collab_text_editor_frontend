import { Models } from "appwrite";

export type PermissionType = "read" | "create" | "delete" | "update";

export interface Document extends Models.Document {
  roomId: string;
  title: string;
  storageData: string;
  created_by: string[];
}
export interface Folder extends Models.Document {
  title: string;
  document: Document[];
  created_by: string[];
}
