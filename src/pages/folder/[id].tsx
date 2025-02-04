import { PermissionType } from "@/action";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { APPWRITE_CLIENT } from "@/lib/appwrite";
import { useAuthStore } from "@/store/authstore";
import { useEffect, useState } from "react";
import React from "react";
import { Link, navigate } from "gatsby";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Folder, Document } from "@/action";

export default function FolderPage({ params }: { params: { id: string } }) {
  const { user } = useAuthStore();

  const [permissions, setPermissions] =
    useState<Record<PermissionType, boolean>>();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [folder, setFolder] = useState<Folder>();

  const fetchDocument = async () => {
    const document = await APPWRITE_CLIENT.databases.getDocument<Folder>(
      process.env.APPWRITE_DATABASE_ID || "",
      process.env.APPWRITE_FOLDER_COLLECTION_ID || "",
      params.id
    );

    setFolder(document);
  };

  const filteredDocuments =
    folder?.document.filter((doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) ?? [];

  const fetchPermissions = async () => {
    // setIsLoading(true);
    try {
      const isPermitted = await fetch(
        "http://localhost:3000/permissions/getresourcepermissions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            permissions: ["read", "update", "delete"],
            resource_instance: `Folder:${params.id}`,
            user: user?.email ?? "",
          }),
        }
      );

      const isPermittedData = await isPermitted.json();

      setPermissions(isPermittedData.result);

      if (isPermittedData.result.read) {
        await fetchDocument();
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!permissions?.read || !user) {
    return (
      <section className="h-screen flex justify-center items-center flex-col gap-4">
        <p>You do not have permission to view this Folder</p>
        <Button
          onClick={() =>
            navigate(
              user ? "/dashboard" : `/login_page?next=/folder/${params.id}`
            )
          }
        >
          {user ? "Dashboard" : "Login"}
        </Button>
      </section>
    );
  }

  if (!folder) {
    return (
      <section className="h-screen flex justify-center items-center">
        <p>Document not found</p>
      </section>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{folder.title}</h1>
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
      </div>
      {folder.document.length === 0 && (
        <p className="text-center text-gray-500">
          You don&apos;t have any folders or documents yet. Click on the New
          Folder or New Document button to create one.
        </p>
      )}

      {filteredDocuments?.length > 0 && (
        <>
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
