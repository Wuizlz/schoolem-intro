// src/pages/SignIn.jsx
import Button from "../ui/Button";
import { useForm } from "react-hook-form";
import Input from "../ui/Input";
import useSignIn from "../hooks/useSignIn";
import { ensureProfile } from "../services/apiProfile";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "", password: "" } });

  const { signIn, isLoading } = useSignIn({
    ensureProfileFn: ensureProfile,
    redirectTo: "/uni",
  });

  return (
    <main className="min-h-dvh flex items-center justify-center bg-black text-zinc-100">
      <div className="w-full max-w-3xl rounded-[4.5rem] border-4 border-zinc-700/60 bg-zinc-900/80 p-8 sm:p-12 flex flex-col gap-8">
        <div className="flex flex-col items-center gap-3 w-full text-center sm:flex-row sm:items-center sm:gap-4 sm:justify-center sm:text-left">
          <img src="/favicon.ico" alt="SchoolEm" className="h-16 w-16  " />
          <h1 className="text-2xl font-semibold sm:text-4xl">
            Welcome Back to SchoolEm!
          </h1>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(signIn)} noValidate>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
            error={errors.email}
          />

          <Input
            id="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Min 8 characters" },
            })}
            error={errors.password}
          />
          <div className=" flex items-center gap-1">
            <Button
              type="modalButtonAlternative"
              to="/ForgotPassword"
              className="self-start text-sm font-semibold text-yellow-400 hover:text-yellow-300 
                hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              disabled={isSubmitting || isLoading}
            >
              Forgot password?
            </Button>
          </div>
          <div className="flex justify-center gap-2">
            <Button
              type="primary"
              buttonType="submit"
              className="self-center"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? "Signing In…" : "Sign In"}
            </Button>
   
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="w-full flex items-center gap-4">
              <span
                aria-hidden
                className="h-0.5 flex-1 bg-zinc-600 rounded-full"
              />
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
