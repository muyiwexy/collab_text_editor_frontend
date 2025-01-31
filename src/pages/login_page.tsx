import Login from "@/components/login";
import React from "react";

const LoginPage = ({ location }: any) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Login location={location} />
    </div>
  );
};

export default LoginPage;
