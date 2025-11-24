import { useForm } from "react-hook-form";

import Input from "./../ui/ui components/Input";
import Button from "../ui/ui components/Button";

import DateAndGenderForm from "../ui/pop-ups/DateAndGenderForm";
import toast from "react-hot-toast";
import { useState } from "react";

export default function SignUp() {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [signupData, setSignupData] = useState(null);

  const {
    register,
    handleSubmit,
    getValues,
    reset,

    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(data) {
    setSignupData(data);
    setShowDetailsModal(true);
  }

  function handleAdditionalInfoSuccess(result) {
    if (result?.profileError) {
      toast.error(result.profileError.message);
      return;
    }

    if (result?.emailConfirmation) {
      toast.success("Check your inbox to verify your account.");
    } else {
      toast.success("Account created! You're all set.");
    }

    reset();
    setSignupData(null);
    setShowDetailsModal(false);
  }

  function handleAdditionalInfoBack() {
    if (signupData) reset(signupData);
    setShowDetailsModal(false);
  }

  if (showDetailsModal && signupData)
    return (
      <main className="min-h-dvh flex items-center justify-center bg-black  text-zinc-100">
        <DateAndGenderForm
          initialData={signupData}
          onSuccess={handleAdditionalInfoSuccess}
          onBack={handleAdditionalInfoBack}
        />
      </main>
    );

  return (
    <main className="min-h-dvh flex items-center justify-center bg-black  text-zinc-100">
      <div className="w-full max-w-3xl rounded-[4.5rem] border-4 border-zinc-700/60 bg-zinc-900/80 p-8 sm:p-12 flex flex-col gap-8">
        {/* Row 1: logo + title */}
        <div className="flex flex-col items-center gap-3 w-full text-center sm:flex-row sm:items-center sm:gap-4 sm:justify-center sm:text-left">
          <img src="/favicon.ico" alt="SchoolEm" className="h-16 w-16" />

          <h3 className="text-2xl font-semibold sm:text-4xl">
            Welcome to SchoolEm!
          </h3>
        </div>

        {/* Row 2: form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                id="firstName"
                type="text"
                placeholder="First name"
                {...register("firstName", {
                  required: "First name is required",
                  minLength: { value: 2, message: "Min 2 characters" },
                })}
                error={errors.firstName}
                autoComplete="given-name"
              />
            </div>

            <div className="flex-1">
              <Input
                id="lastName"
                type="text"
                placeholder="Last name"
                {...register("lastName", {
                  required: "Last name is required",
                  minLength: { value: 2, message: "Min 2 characters" },
                })}
                error={errors.lastName}
                autoComplete="family-name"
              />
            </div>
          </div>

          <Input
            id="username"
            type="text"
            placeholder="Username"
            {...register("username", {
              required: "Username is required",
              minLength: { value: 3, message: "Min 3 characters" },
            })}
            error={errors.username}
            autoComplete="username"
          />

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

          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (val) =>
                val === getValues("password") || "Passwords do not match",
            })}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />

          <div className="flex flex-col items-center gap-3">
            {/* Submit button in a form */}

            <Button
              type="primary"
              buttonType="submit"
              className="self-center"
              disabled={isSubmitting}
            >
              Sign Up
            </Button>

            <div className="w-full flex items-center gap-4">
              <span
                aria-hidden="true"
                className="h-0.5 flex-1 bg-zinc-600 rounded-full"
              ></span>
              <span className="text-sm font-semibold text-zinc-200">or</span>
              <span
                aria-hidden="true"
                className="h-0.5 flex-1 bg-zinc-600"
              ></span>
            </div>
            {/* Link-style button */}
            <Button type="primary" to="/signin" className="self-center">
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

//
