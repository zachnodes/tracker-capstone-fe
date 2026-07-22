import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Gamepad2, Trophy, TrendingUp } from "lucide-react";

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login/signup functionality
    const user = username || email.split('@')[0];
    onLogin(user);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1759692788195-b95da1f4a04c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb250cm9sbGVyJTIwZXNwb3J0cyUyMGRhcmt8ZW58MXx8fHwxNzc1MDA2MjAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Gaming background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Main Content */}
      <div className="z-10 w-full max-w-md px-4">
        {/* Logo/Title Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Gamepad2 className="w-16 h-16 text-red-500" />
              <Trophy className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Melee Tracker
          </h1>
          <p className="text-slate-400">
            Track your path to competitive excellence
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-slate-800 bg-slate-900/90 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-white">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-center text-slate-400">
              {isLogin 
                ? "Enter your credentials to access your stats" 
                : "Start tracking your Melee performance today"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-200">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your tag"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-red-500"
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-red-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-red-500"
                  required
                />
              </div>

              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            {/* Toggle between Login/Signup */}
            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-red-400 hover:text-red-300 font-medium transition-colors"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>

            {/* Demo Login Button */}
            {isLogin && (
              <div className="mt-4">
                <Button
                  type="button"
                  onClick={() => onLogin("DemoPlayer")}
                  variant="outline"
                  className="w-full border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Quick Demo Login
                </Button>
              </div>
            )}

            {/* Features Preview */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-300">
                  <TrendingUp className="w-5 h-5 text-red-500" />
                  <span className="text-sm">Track match history & statistics</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm">Analyze matchup performance</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Gamepad2 className="w-5 h-5 text-blue-500" />
                  <span className="text-sm">Import from start.gg API</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-slate-500 text-xs">
          <p>Unofficial community tool for SSBM players</p>
        </div>
      </div>
    </div>
  );
}