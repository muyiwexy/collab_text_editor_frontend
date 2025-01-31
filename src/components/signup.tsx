import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authstore";
import { Link, navigate } from "gatsby";
import React from "react";

interface SignupPageProps {
  location: {
    search: string;
  };
}

const Register: React.FC<SignupPageProps> = ({ location }) => {
  const params = new URLSearchParams(location.search);
  const nextPath = params.get("next");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { register, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(email, password, name);
    if (!error) {
      navigate(nextPath ?? "/dashboard");
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create a new account.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
          <Button type="submit">Register</Button>
          <Link to={nextPath ? `/login_page?next=${nextPath}` : "/login_page"}>
            Login
          </Link>
        </CardFooter>
      </form>
      {error && <p className="text-red-500 text-center mt-2 py-2">{error}</p>}
    </Card>
  );
};

export default Register;
