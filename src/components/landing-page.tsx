"use client";

import { FileText, Users, Share2, ShieldCheck } from "lucide-react";
import { useAuthStore } from "../store/authstore";

import React from "react";
import { Link } from "gatsby";
import { Button } from "./ui/button";

export default function LandingPage() {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Collaborate on Documents in Real-Time
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Create, edit, and share documents with ease. Powerful
                  collaboration tools for teams of all sizes.
                </p>
              </div>
              {user ? (
                <Button asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <div className="space-x-4">
                  <Button variant={"default"} asChild>
                    <Link to="/signup_page">Get Started</Link>
                  </Button>
                  <Button variant={"outline"} asChild>
                    <Link to="/login_page">Log In</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100"
          id="features"
        >
          <div className="px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <FileText className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-lg font-bold">Rich Text Editing</h3>
                <p className="text-sm text-gray-500">
                  Create beautiful documents with our powerful rich text editor.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Users className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-lg font-bold">Real-Time Collaboration</h3>
                <p className="text-sm text-gray-500">
                  Work together in real-time with your team members.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Share2 className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-lg font-bold">Easy Sharing</h3>
                <p className="text-sm text-gray-500">
                  Share your documents with others quickly and securely.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <ShieldCheck className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-lg font-bold">Role-Based Access</h3>
                <p className="text-sm text-gray-500">
                  Control access with Owner, Editor, and Viewer roles.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Start Collaborating Today
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Join thousands of teams already using CollabDocs to streamline
                  their document workflows.
                </p>
              </div>
              <Button asChild size="lg">
                <Link to={user ? "/dashboard" : "/signup_page"}>
                  Sign Up for Free
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} CollabDocs. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
