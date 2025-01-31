import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface CreateDialogProps {
  type: "folder" | "document";
  isOpen: boolean;
  isCreating: boolean;
  title: string;
  onOpenChange: (open: boolean) => void;
  onTitleChange: (title: string) => void;
  onSubmit: () => void;
}

export function CreateDialog({
  type,
  isOpen,
  isCreating,
  title,
  onOpenChange,
  onTitleChange,
  onSubmit,
}: CreateDialogProps) {
  return (
    <Dialog
      modal
      open={isOpen}
      onOpenChange={(value) => onOpenChange(isCreating ? isCreating : value)}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New{" "}
          {type === "folder" ? "Folder" : "Document"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create New {type === "folder" ? "Folder" : "Document"}
          </DialogTitle>
          <DialogDescription>
            Enter a title for your new {type}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input
              id="name"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSubmit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
