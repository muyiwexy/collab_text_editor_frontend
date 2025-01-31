import { toast } from "@/hooks/use-toast";
import { APPWRITE_CLIENT } from "@/lib/appwrite";
import { ID, Models } from "appwrite";
import { Document } from "@/action";

export function createDocumentFunction(
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>,
  newDocTitle: string,
  user: Models.User<Models.Preferences> | null,
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>,
  setNewDocTitle: React.Dispatch<React.SetStateAction<string>>,
  setIsDocumentDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  return async () => {
    setIsLoading(true);
    setIsCreating(true);
    try {
      const documentId = ID.unique();
      const response = await APPWRITE_CLIENT.databases.createDocument<Document>(
        process.env.APPWRITE_DATABASE_ID || "",
        process.env.APPWRITE_DOCUMENT_COLLECTION_ID || "",
        documentId,
        {
          title: newDocTitle.trim(),
          roomId: documentId,
          created_by: [user?.$id ?? ""],
        }
      );

      const createdInstance = await fetch(
        "http://localhost:3000/permissions/createresource",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: documentId,
            resource: "document",
          }),
        }
      );

      const createdData = await createdInstance.json();

      const assignedRole = await fetch(
        "http://localhost:3000/permissions/assignresourcetouser",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resource_instance: `document:${createdData.result.key}`,
            role: "owner",
            user: user?.email ?? "",
          }),
        }
      );

      if (!createdInstance.ok || !assignedRole) {
        throw new Error("Failed to set up document permissions");
      }

      setDocuments((prev) => [...prev, response]);
      setNewDocTitle("");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
      setIsLoading(false);
      setIsDocumentDialogOpen(false);
    }
  };
}
