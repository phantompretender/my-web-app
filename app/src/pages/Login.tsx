import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("signin");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" });

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      toast.success("Welcome back");
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.message || "Login failed");
    },
  });

  const registerMutation = trpc.localAuth.register.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      toast.success("Account created");
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.message || "Registration failed");
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <Card className="border-borderMuted shadow-card">
          <CardHeader className="text-center pb-2">
            <CardTitle className="font-serif text-2xl text-rose-deep">Velvet Rose</CardTitle>
            <p className="text-sm text-foreground/50 mt-1">Sign in to your account</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* OAuth Button */}
            <Button
              variant="outline"
              className="w-full h-11 border-rose-coral/30 text-rose-coral hover:bg-rose-cream hover:text-rose-deep"
              size="lg"
              onClick={() => {
                window.location.href = getOAuthUrl();
              }}
            >
              Continue with Kimi
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-borderMuted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-foreground/40">or</span>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 bg-rose-cream/50">
                <TabsTrigger value="signin" className="text-sm">Sign In</TabsTrigger>
                <TabsTrigger value="register" className="text-sm">Create Account</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleLogin} className="space-y-3 mt-4">
                  <div>
                    <Label className="text-sm text-foreground/70">Email</Label>
                    <Input
                      type="email"
                      required
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="mt-1 h-11 border-borderMuted focus:border-rose-coral"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-foreground/70">Password</Label>
                    <Input
                      type="password"
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="mt-1 h-11 border-borderMuted focus:border-rose-coral"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-rose-deep hover:bg-rose-deep/90 text-white"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-3 mt-4">
                  <div>
                    <Label className="text-sm text-foreground/70">Name</Label>
                    <Input
                      type="text"
                      required
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      className="mt-1 h-11 border-borderMuted focus:border-rose-coral"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-foreground/70">Email</Label>
                    <Input
                      type="email"
                      required
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="mt-1 h-11 border-borderMuted focus:border-rose-coral"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-foreground/70">Password</Label>
                    <Input
                      type="password"
                      required
                      minLength={6}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="mt-1 h-11 border-borderMuted focus:border-rose-coral"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-rose-deep hover:bg-rose-deep/90 text-white"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creating..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <p className="text-center text-xs text-foreground/40 mt-4">
              By continuing, you agree to our{" "}
              <Link to="#" className="text-rose-coral hover:text-rose-deep">
                Terms
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
