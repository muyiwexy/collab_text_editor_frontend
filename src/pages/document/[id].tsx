import { PermissionType } from "@/action";
import { DeleteDocument } from "@/components/delete-document";
import { CollaborativeEditor } from "@/components/editor/collaborative-editor";
import LiveblocksWrapper from "@/components/editor/liveblocks-wrapper";
import Loader from "@/components/loader";
import { ShareDocument } from "@/components/share-document";
import { Button } from "@/components/ui/button";
import { APPWRITE_CLIENT } from "@/lib/appwrite";
import { Models } from "appwrite";
import { useAuthStore } from "@/store/authstore";
import { useEffect, useState } from "react";
import React from "react";
import { navigate } from "gatsby";

export interface Document extends Models.Document {
  roomId: string;
  title: string;
  storageData: string;
  created_by: string;
}

export default function DocumentPage({ params }: { params: { id: string } }) {
  const { user } = useAuthStore();

  const [permissions, setPermissions] =
    useState<Record<PermissionType, boolean>>();
  const [isLoading, setIsLoading] = useState(true);
  const [document, setDocument] = useState<Document | null>(null);

  const fetchDocument = async () => {
    const document = await APPWRITE_CLIENT.databases.getDocument<Document>(
      process.env.APPWRITE_DATABASE_ID || "",
      process.env.APPWRITE_DOCUMENT_COLLECTION_ID || "",
      params.id
    );

    setDocument(document);
  };

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
            resource_instance: `Document:${params.id}`,
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
        <p>You do not have permission to view this document</p>
        <Button
          onClick={() =>
            navigate(
              user ? "/dashboard" : `/login_page?next=/document/${params.id}`
            )
          }
        >
          {user ? "Dashboard" : "Login"}
        </Button>
      </section>
    );
  }

  if (!document) {
    return (
      <section className="h-screen flex justify-center items-center">
        <p>Document not found</p>
      </section>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{document.title}</h1>
        <div className="flex gap-4">
          <ShareDocument
            permission={permissions.update}
            documentId={params.id}
          />
          <DeleteDocument
            documentId={params.id}
            permission={permissions.delete}
          />
        </div>
      </div>
      <LiveblocksWrapper permissions={permissions} roomId={document.roomId}>
        <CollaborativeEditor isReadOnly={!permissions.update} />
      </LiveblocksWrapper>
    </div>
  );
}
