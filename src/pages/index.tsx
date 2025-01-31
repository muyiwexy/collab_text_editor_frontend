import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import LandingPage from "../components/landing-page";

const IndexPage: React.FC<PageProps> = () => {
  return <LandingPage />;
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
