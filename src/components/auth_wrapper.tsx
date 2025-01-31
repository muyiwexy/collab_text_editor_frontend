import { LoaderIcon } from "lucide-react";
import { navigate } from "gatsby";
import { useEffect } from "react";
import React from "react";
import { useAuthStore } from "../store/authstore";

interface AuthWrapperProps {
  children: React.ReactNode;
  location?: Location;
}

export default function AuthWrapper({ children, location }: AuthWrapperProps) {
  const pathname = location?.pathname;
  const { user, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Handle redirect when user is not authenticated
    if (!isLoading && !user && pathname?.startsWith("/dashboard")) {
      navigate("/login_page");
    }
  }, [user, isLoading, pathname]);

  if (isLoading) {
    return (
      <section className="h-screen flex justify-center items-center">
        <LoaderIcon className="w-8 h-8 animate-spin" />
      </section>
    );
  }

  return <>{children}</>;
}
