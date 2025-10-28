import Button from "../ui/Button";
import { useForm } from "react-hook-form";
import Input from "../ui/Input";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();
  
  function onSubmit(data)
  {
    console.log(data)
  }

  return (
    <main className="min-h-dvh flex items-center justify-center bg-black  text-zinc-100">
      <div className="w-full max-w-3xl rounded-[4.5rem] border-4 border-zinc-700/60 bg-zinc-900/80 p-8 sm:p-12 flex flex-col gap-8">
        {/* Row 1: logo + title */}
         <div className="relative flex items-center justify-center w-full h-16">
          <img
            src="/favicon.ico"
            alt="SchoolEm"
            className="h-16 w-16 absolute left-0"
          />

          <h1 className="text-3xl sm:text-4xl font-semibold text-center">
            Welcome Back to SchoolEm!
          </h1>
        </div>

        {/* Row 2: form */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
           <Input
            id="email"
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
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
            autoComplete="new-password"
          />

          <div className="flex flex-col items-center gap-3">
            {/* Submit button in a form */}
            <Button type="primary" buttonType="submit" className="self-center">
              Sign Up
            </Button>
            <p>Or</p>
            {/* Link-style button */}
            <Button type="primary" to="/signup" className="self-center">
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
