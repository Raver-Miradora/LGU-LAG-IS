import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/stores/authStore";
import { apiPost } from "@/lib/api";

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setError("");
    setLoading(true);
    try {
      const res = await apiPost<{
        user: { id: string; username: string; fullName: string; role: string };
        accessToken: string;
        refreshToken: string;
      }>("/auth/login", data);
      const { user, accessToken, refreshToken } = res as any;
      setAuth({ user, accessToken, refreshToken });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
        <div className="w-full max-w-sm space-y-8">
          {/* Brand */}
          <div className="text-center">
            <img
              src="/images/lagonoy-logo.jpg"
              alt="LGU Lagonoy"
              className="mx-auto h-20 w-20 rounded-full border-2 border-[var(--border)] object-cover shadow-md"
            />
            <h1 className="mt-4 text-2xl font-bold">LGU Lagonoy</h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Local Government Unit Information System
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
          >
            <h2 className="mb-6 text-lg font-semibold">Sign In</h2>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <Input
                id="username"
                label="Username"
                placeholder="Enter your username"
                error={errors.username?.message}
                {...register("username", { required: "Username is required" })}
              />
              <Input
                id="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register("password", { required: "Password is required" })}
              />
            </div>

            <Button
              type="submit"
              className="mt-6 w-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-xs text-[var(--muted-foreground)]">
            &copy; {new Date().getFullYear()} Local Government Unit of Lagonoy
          </p>
        </div>
    </div>
  );
}
