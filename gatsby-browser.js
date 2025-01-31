import "./src/styles/global.css";
import Layout from "./src/components/layout";
import AuthWrapper from "./src/components/auth_wrapper";
import React from "react";

export const wrapPageElement = ({ element, props }) => {
  return (
    <AuthWrapper location={props.location}>
      <Layout>{element}</Layout>
    </AuthWrapper>
  );
};
