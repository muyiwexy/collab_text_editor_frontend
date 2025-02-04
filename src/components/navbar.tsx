import { Link as LucideLink } from "lucide-react";

import React from "react";
import { useAuthStore } from "../store/authstore";
import { Link as GatsbyLink } from "gatsby";
import { Button } from "./ui/button";

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b shadow-md">
      <GatsbyLink className="flex items-center justify-center" to="/">
        <LucideLink className="h-6 w-6 mr-2" />
        <span className="font-extrabold">Collaborative text editor</span>
      </GatsbyLink>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        {user ? (
          <div className="flex gap-4 items-center">
            <span>
              {user.name} ({user.email})
            </span>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        ) : (
          <GatsbyLink
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/#features"
          >
            Features
          </GatsbyLink>
        )}
      </nav>
    </header>
  );
}
