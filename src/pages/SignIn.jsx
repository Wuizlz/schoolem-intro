// src/pages/SignIn.jsx
import Button from "../ui/Button";
import { useForm } from "react-hook-form";
import Input from "../ui/Input";
import supabase from "../services/supabase";
import { ensureProfile } from "../services/apiProfile";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SignIn() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit({ email, password }) {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // If sign-in succeeds (and the email is already confirmed), we have a session.
      await ensureProfile();
      navigate("/uni");
    } catch (e) {
      const msg = e?.message || "Sign in failed";
      // Common case: account exists but email isn't confirmed yet.
      if (/confirm/i.test(msg) && /email/i.test(msg)) {
        try {
          await supabase.auth.resend({
            type: "signup",
            email: getValues("email"),
            options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
          });
          toast.success("Your email isn’t verified yet. I’ve sent a new confirmation link.");
          return;
        } catch (resendErr) {
          toast.error(resendErr?.message || "Couldn’t resend the confirmation email.");
          return;
        }
      }
      toast.error(msg);
      console.error(e);
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center bg-black text-zinc-100">
      <div className="w-full max-w-3xl rounded-[4.5rem] border-4 border-zinc-700/60 bg-zinc-900/80 p-8 sm:p-12 flex flex-col gap-8">
        <div className="relative flex items-center justify-center w-full h-16">
          <img src="/favicon.ico" alt="SchoolEm" className="h-16 w-16 absolute left-0" />
          <h1 className="text-3xl sm:text-4xl font-semibold text-center">
            Welcome Back to SchoolEm!
          </h1>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
            })}
            error={errors.email}
            autoComplete="email"
          />

          <Input
            id="password"
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Min 8 characters" },
            })}
            error={errors.password}
            autoComplete="current-password"
          />

          <div className="flex flex-col items-center gap-3">
            <Button type="primary" buttonType="submit" className="self-center" disabled={isSubmitting}>
              {isSubmitting ? "Signing In…" : "Sign In"}
            </Button>

            <div className="w-full flex items-center gap-4">
              <span aria-hidden className="h-0.5 flex-1 bg-zinc-600 rounded-full" />
              <span className="text-sm font-semibold text-zinc-200">or</span>
              <span aria-hidden className="h-0.5 flex-1 bg-zinc-600" />
            </div>

            <Button type="primary" to="/signup" className="self-center">
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
