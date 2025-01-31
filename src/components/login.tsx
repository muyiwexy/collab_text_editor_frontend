import React, { useState } from "react";
import { navigate, Link } from "gatsby";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/authstore";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";

interface LoginPageProps {
  location: {
    search: string;
  };
}

const Login: React.FC<LoginPageProps> = ({ location }) => {
  const params = new URLSearchParams(location.search);
  const nextPath = params.get("next");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    if (!error) {
      navigate(nextPath ?? "/dashboard");
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your email and password to login.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit">Login</Button>
          <Link
            to={`/signup_page${nextPath ? `?next=${nextPath}` : ""}`}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-100 hover:text-slate-900"
          >
            Sign up
          </Link>
        </CardFooter>
      </form>
      {error && <p className="text-red-500 text-center mt-2 py-2">{error}</p>}
    </Card>
  );
};

export default Login;
