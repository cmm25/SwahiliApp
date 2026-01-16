'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { SketchButton } from "@/components/shared/SketchButton";
import { SketchCard } from "@/components/shared/SketchCard";
import { FloatingElement } from "@/components/shared/FloatingElement";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: error.message === "Invalid login credentials"
              ? "Invalid email or password. Please try again."
              : error.message,
          });
        } else {
          toast({
            title: "Karibu! (Welcome!)",
            description: "You have successfully logged in.",
          });
          router.push("/dashboard");
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, formData.name);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              variant: "destructive",
              title: "Account Exists",
              description: "This email is already registered. Please login instead.",
            });
            setIsLogin(true);
          } else {
            toast({
              variant: "destructive",
              title: "Signup Failed",
              description: error.message,
            });
          }
        } else {
          toast({
            title: "Account Created!",
            description: "Welcome to Jifunze! Let's set up your profile.",
          });
          // Redirect new users to onboarding
          router.push("/onboarding");
        }
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const greetings = [
    { swahili: "Karibu!", english: "Welcome!" },
    { swahili: "Habari!", english: "Hello!" },
    { swahili: "Jambo!", english: "Hi!" },
  ];

  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <FloatingElement className="absolute top-20 left-10 opacity-30" delay={0}>
        <div className="w-16 h-16 sketch-border bg-accent/20 rotate-12" />
      </FloatingElement>
      <FloatingElement className="absolute top-40 right-16 opacity-30" delay={0.5} reverse>
        <div className="w-12 h-12 sketch-border bg-secondary rotate-[-8deg]" />
      </FloatingElement>
      <FloatingElement className="absolute bottom-32 left-20 opacity-30" delay={1}>
        <div className="w-20 h-8 sketch-border bg-muted rotate-6" />
      </FloatingElement>
      <FloatingElement className="absolute bottom-20 right-10 opacity-30" delay={1.5} reverse>
        <div className="w-10 h-10 sketch-border bg-accent/30 rotate-[-12deg]" />
      </FloatingElement>

      {/* Logo */}
      <Link href="/" className="mb-8">
        <h1 className="font-hand text-5xl text-accent animate-fade-in-scale">Jifunze</h1>
      </Link>

      {/* Greeting */}
      <div className="text-center mb-8 animate-fade-in-up">
        <h2 className="font-hand text-4xl text-foreground mb-2" suppressHydrationWarning>
          {randomGreeting.swahili}
        </h2>
        <p className="font-hand-secondary text-muted-foreground" suppressHydrationWarning>
          {randomGreeting.english}
        </p>
      </div>

      {/* Auth Card */}
      <SketchCard className="w-full max-w-md animate-fade-in-up stagger-2">
        {/* Toggle */}
        <div className="flex mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={cn(
              "flex-1 py-2 font-hand-secondary text-lg transition-all",
              isLogin
                ? "text-accent border-b-2 border-accent"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Ingia (Login)
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={cn(
              "flex-1 py-2 font-hand-secondary text-lg transition-all",
              !isLogin
                ? "text-accent border-b-2 border-accent"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Jisajili (Sign up)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name (signup only) */}
          {!isLogin && (
            <div className="space-y-2 animate-fade-in-up">
              <label className="font-hand-secondary text-sm text-foreground">
                Jina lako (Your name)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 sketch-border bg-background font-hand-secondary focus:outline-none focus:border-accent"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <label className="font-hand-secondary text-sm text-foreground">
              Barua pepe (Email)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 sketch-border bg-background font-hand-secondary focus:outline-none focus:border-accent"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="font-hand-secondary text-sm text-foreground">
              Nywila (Password)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 sketch-border bg-background font-hand-secondary focus:outline-none focus:border-accent"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <SketchButton
            type="submit"
            variant="accent"
            size="lg"
            className="w-full mt-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-pulse">Subiri... (Wait...)</span>
            ) : isLogin ? (
              "Ingia (Login)"
            ) : (
              "Jisajili (Sign up)"
            )}
          </SketchButton>
        </form>
      </SketchCard>

      {/* Back to landing */}
      <Link
        href="/"
        className="mt-6 font-hand-secondary text-muted-foreground hover:text-accent transition-colors"
      >
        ← Rudi nyumbani (Back home)
      </Link>
    </div>
  );
}
