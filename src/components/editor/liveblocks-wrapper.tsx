import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import Loader from "../loader";
import { useAuthStore } from "@/store/authstore";
import React from "react";
import { PermissionType } from "@/action";

interface LiveblocksWrapperProps {
  children: React.ReactNode;
  roomId: string;
  permissions: Record<PermissionType, boolean>;
}

export default function LiveblocksWrapper({
  children,
  roomId,
  permissions,
}: Readonly<LiveblocksWrapperProps>) {
  const { user } = useAuthStore();

  return (
    <LiveblocksProvider
      authEndpoint={async (room) => {
        const response = await fetch("http://localhost:3000/liveblocks/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: user,
            roomId: roomId,
            room,
            permissions,
          }),
        });
        const responseData = await response.json();
        return responseData;
      }}
    >
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null,
        }}
      >
        <ClientSideSuspense fallback={<Loader />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
