"use client";

import { registerUser } from "@/actions/registerUser";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { RegisterUserSchema, Role } from "@/validaton-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, Phone, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

interface RegisterFormProps {
  text?: string;
  role?: Role;
}

export default function RegisterForm({ text = "Create your account to join our community", role = "USER" }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterUserSchema>>({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      role: role,
    },
  });

  async function onSubmit(data: z.infer<typeof RegisterUserSchema>) {
    if (isPending) return;

    setError(undefined);
    setSuccess(undefined);

    try {
      startTransition(async () => {
        const result = await registerUser(data);

        if (result?.error) {
          setError(result.error);
          return;
        }

        if (result?.success) {
          setSuccess(result.success);
          form.reset();
          toast({
            title: "🎉 Registration Successful",
            description: result.success,
          });

          // Optional: Redirect after successful registration
          // if (result.redirectTo) {
          //   await new Promise((resolve) => setTimeout(resolve, 1000));
          //   window.location.href = result.redirectTo;
          // }
        }
      });
    } catch (e) {
      console.error("Registration error:", e);
      setError("Registration failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Decorative with Pink Gradient */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary">
          {/* Decorative circles */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-16 text-black">
          <div className="max-w-md space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                Join She At Work Community
              </span>
            </div>

            <h2 className="text-5xl font-bold leading-tight">
              Start Your Journey With Us
            </h2>

            <p className="text-lg text-black">
              Create an account to unlock exclusive resources, networking opportunities, 
              and career advancement tools tailored for women professionals.
            </p>

            <div className="space-y-4 pt-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-black"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Personalized Dashboard</h3>
                  <p className="text-black text-sm">
                    Track your progress and access curated resources
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-black"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Networking Events</h3>
                  <p className="text-black text-sm">
                    Connect with mentors and peers in exclusive events
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-black"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Career Opportunities</h3>
                  <p className="text-black text-sm">
                    Access job postings and career development programs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 ">
        <div className="w-full max-w-md">
         

          {/* Registration Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 py-4 border border-[#D5B5A9]/30">
           
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-[#2C2A2D]">Create Account</h1>
              <p className="text-sm text-[#2C2A2D]/60 mt-2">{text}</p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Full Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="text-md font-semibold text-[#2C2A2D] mb-2">
                        Full Name
                      </div>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="John Snow"
                            className="h-11 px-4 pl-11 border-[#D5B5A9] rounded-xl focus:ring-2 focus:ring-[#CF2554] focus:border-transparent transition-all"
                            disabled={isPending}
                          />
                        </FormControl>
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2C2A2D]/50" />
                      </div>
                      <FormMessage className="text-sm text-[#CF2554]" />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="text-md font-semibold text-[#2C2A2D] mb-2">
                        Email Address
                      </div>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="john.snow@gmail.com"
                            className="h-11 px-4 pl-11 border-[#D5B5A9] rounded-xl focus:ring-2 focus:ring-[#CF2554] focus:border-transparent transition-all"
                            type="email"
                            disabled={isPending}
                          />
                        </FormControl>
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2C2A2D]/50" />
                      </div>
                      <FormMessage className="text-sm text-[#CF2554]" />
                    </FormItem>
                  )}
                />

                {/* Phone Field */}
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <div className="text-md font-semibold text-[#2C2A2D] mb-2">
                        Phone Number
                      </div>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="+1 (555) 123-4567"
                            className="h-11 px-4 pl-11 border-[#D5B5A9] rounded-xl focus:ring-2 focus:ring-[#CF2554] focus:border-transparent transition-all"
                            disabled={isPending}
                          />
                        </FormControl>
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2C2A2D]/50" />
                      </div>
                      <FormMessage className="text-sm text-[#CF2554]" />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="text-md font-semibold text-[#2C2A2D] mb-2">
                        Password
                      </div>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="••••••••"
                            className="h-11 px-4 pl-11 pr-12 border-[#D5B5A9] rounded-xl focus:ring-2 focus:ring-[#CF2554] focus:border-transparent transition-all"
                            type={showPassword ? "text" : "password"}
                            disabled={isPending}
                          />
                        </FormControl>
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2C2A2D]/50" />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2C2A2D]/50 hover:text-[#2C2A2D] transition-colors"
                          onClick={togglePasswordVisibility}
                          disabled={isPending}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      <FormMessage className="text-sm text-[#CF2554]" />
                    </FormItem>
                  )}
                />

             

                <FormError message={error} />
                <FormSuccess message={success} />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-11 bg-gradient-to-r from-[#CF2554] to-[#E64B78] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm shadow-md"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#D5B5A9]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-[#2C2A2D]/50">or</span>
                  </div>
                </div>

                <div className="text-center">
                  <Link
                    href="/auth/login"
                    className="text-sm text-[#2C2A2D]/60 hover:text-[#2C2A2D] transition-colors"
                  >
                    Already have an account?{" "}
                    <span className="text-[#CF2554] hover:text-[#E64B78] font-semibold">
                      Sign In
                    </span>
                  </Link>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}