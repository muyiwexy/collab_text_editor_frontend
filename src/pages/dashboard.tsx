import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Search, Folder as FolderIcon } from "lucide-react";
import { Link } from "gatsby";
import { APPWRITE_CLIENT } from "@/lib/appwrite";
import { ID, Models, Query } from "appwrite";

import Loader from "@/components/loader";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authstore";
import { CreateDialog } from "@/components/dashboard_dialog";
import React from "react";
import { Document, Folder } from "@/action";
import { createDocumentFunction } from "@/store/helper_functions";

export default function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newFolderTitle, setNewFolderTitle] = useState("");
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { user } = useAuthStore();

  // Get all document IDs that are in folders
  const getDocumentsInFolders = (folders: Folder[]): string[] => {
    return folders.flatMap(
      (folder) => folder.documentCollection?.map((doc) => doc.$id) ?? []
    );
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch folders first to get the relationships
      const folderResponse =
        await APPWRITE_CLIENT.databases.listDocuments<Folder>(
          process.env.APPWRITE_DATABASE_ID || "",
          process.env.APPWRITE_FOLDER_COLLECTION_ID || "",
          [Query.contains("created_by", [user?.$id ?? ""]), Query.limit(100)]
        );

      const fetchedFolders = folderResponse.documents;
      setFolders(fetchedFolders);

      // Get IDs of all documents that are in folders
      const documentsInFolders = getDocumentsInFolders(fetchedFolders);

      // Fetch all documents
      const documentResponse =
        await APPWRITE_CLIENT.databases.listDocuments<Document>(
          process.env.APPWRITE_DATABASE_ID || "",
          process.env.APPWRITE_DOCUMENT_COLLECTION_ID || "",
          [Query.contains("created_by", [user?.$id ?? ""]), Query.limit(100)]
        );

      // Filter out documents that are already in folders
      const standaloneDocuments = documentResponse.documents.filter(
        (doc) => !documentsInFolders.includes(doc.$id)
      );

      setDocuments(standaloneDocuments);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter documents based on search term
  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter folders based on search term
  const filteredFolders = folders.filter((folder) =>
    folder.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateDocument = createDocumentFunction(
    setIsLoading,
    setIsCreating,
    newDocTitle,
    user,
    setDocuments,
    setNewDocTitle,
    setIsDocumentDialogOpen
  );

  const handleCreateFolder = async () => {
    setIsLoading(true);
    setIsCreating(true);
    try {
      const folderId = ID.unique();
      const response = await APPWRITE_CLIENT.databases.createDocument<Folder>(
        process.env.APPWRITE_DATABASE_ID || "",
        process.env.APPWRITE_FOLDER_COLLECTION_ID || "",
        folderId,
        {
          title: newFolderTitle.trim(),
          created_by: [user?.$id ?? ""],
          documentCollection: [], // Initialize with empty collection
        }
      );

      const createdInstance = await fetch(
        "http://localhost:3000/permissions/createresource",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: folderId,
            resource: "Folder",
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
            resource_instance: `Folder:${createdData.result.key}`,
            role: "Admin",
            user: user?.email ?? "",
          }),
        }
      );

      if (!createdInstance.ok || !assignedRole) {
        throw new Error("Failed to set up folder permissions");
      }

      setFolders((prev) => [...prev, response]);
      setNewFolderTitle("");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create folder. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
      setIsLoading(false);
      setIsFolderDialogOpen(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Documents</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <CreateDialog
            type="folder"
            isOpen={isFolderDialogOpen}
            isCreating={isCreating}
            title={newFolderTitle}
            onOpenChange={setIsFolderDialogOpen}
            onTitleChange={setNewFolderTitle}
            onSubmit={handleCreateFolder}
          />
          <CreateDialog
            type="document"
            isOpen={isDocumentDialogOpen}
            isCreating={isCreating}
            title={newDocTitle}
            onOpenChange={setIsDocumentDialogOpen}
            onTitleChange={setNewDocTitle}
            onSubmit={handleCreateDocument}
          />
        </div>
      </div>

      {folders.length === 0 && documents.length === 0 && (
        <p className="text-center text-gray-500">
          You don&apos;t have any folders or documents yet. Click on the New
          Folder or New Document button to create one.
        </p>
      )}

      {/* Folders Section */}
      {filteredFolders.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Folders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredFolders.map((folder) => (
              <Card key={folder.$id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderIcon className="h-5 w-5" />
                    {folder.title}
                  </CardTitle>
                  <CardDescription>
                    {folder.documentCollection.length} documents
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild>
                    <Link to={`/folder/${folder.$id}`}>Open</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Documents Section */}
      {filteredDocuments.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <Card key={doc.$id}>
                <CardHeader>
                  <CardTitle>{doc.title}</CardTitle>
                  <CardDescription>
                    Last edited: {new Date(doc.$updatedAt).toDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileText className="h-16 w-16 text-gray-400" />
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link to={`/document/${doc.$id}`}>Open</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
