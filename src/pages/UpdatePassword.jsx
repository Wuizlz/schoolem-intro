import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import Input from "../ui/Input";
import usePasswordUpdate from "../services/passwordUpdate";



export default function UpdatePassword() {
    const location = useLocation();
    const { verifyRecoverySession, updatePassword } = usePasswordUpdate();
    const [ status, setStatus ] = useState("verifying");
    const [ statusMessage, setStatusMessage ] = useState("");
    const [ formError, setFormError ] = useState("");

    const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    let active = true;

     async function verify() {
      setStatus("verifying");
      setStatusMessage("");
      setFormError("");
      console.log("Verifying recovery session with hash:", location.hash, "and search:", location.search);

      try {
        const result = await verifyRecoverySession({
          hash: location.hash,
          search: location.search,
        });

        if (!active) return;
        if (!result?.ok) {
            console.log("Verification failed:", result?.error);
          throw new Error(result?.error || "Couldn't verify this reset link.");
        }

        setStatus("ready");

        if (typeof window !== "undefined" && window.history?.replaceState) {
            console.log("Clearing URL parameters to prevent reuse of the reset link.");
          window.history.replaceState({}, document.title, "/UpdatePassword");
        }
      } catch (err) {
        if (!active) return;
        console.error(err);
        setStatus("error");
        setStatusMessage(err?.message || "Couldn't verify this reset link.");
      }
    }

    verify();
    return () => {
      active = false;
    };
  }, [location.hash, location.search, verifyRecoverySession]);

  const passwordValue = watch("password");
  const canSubmit = status === "ready";

  const onSubmit = async ({ password }) => {
    setFormError("");
    try {
      const result = await updatePassword(password);
      if (result?.ok) {
        setStatus("success");
        setStatusMessage("Password updated successfully.");
        reset();
      }
    } catch (err) {
      console.error(err);
      setFormError(err?.message || "Couldn't update password.");
    }
  };

  const renderContent = () => {
    if (status === "error") {
      return (
        <div className="space-y-4 text-center text-sm text-red-300">
          <p>{statusMessage}</p>
          <Button type="primary" to="/ForgotPassword" className="self-center">
            Request a new reset link
          </Button>
        </div>
      );
    }

    if (status === "success") {
      return (
        <div className="space-y-5 text-center">
          <p className="text-base text-zinc-200">
            Password updated. You can now sign in with your new password.
          </p>
          <Button type="primary" to="/signin" className="self-center">
            Back to Sign In
          </Button>
        </div>
      );
    }

    return (
        
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <p className="text-sm text-center text-zinc-300">
                        Enter your new password below to update your account password. You can then use this new password to sign in!
                    </p>


                    <Input
                        id="password"
                        type="password"
                        placeholder="New Password"
                        autoComplete="new-password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 8, message: "Min 8 characters" },
                        })}
                        error={errors.password}
                    />

                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        autoComplete="new-password"
                        {...register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (val) =>
                                val === passwordValue || "Passwords do not match",
                        })}
                        error={errors.confirmPassword}
                    />
                    {formError && (
                        <p className="text-sm text-center text-red-500">{formError}</p>
                    )}

                    <div className="flex flex-col items-center gap-3">
                        <Button
                            type="primary"
                            buttonType="submit"
                            className="self-center"
                            disabled={!canSubmit || isSubmitting}
                        >
                            {isSubmitting ? "Updating Password..." : "Update Password"}
                        </Button>
                    </div>
                </form>
    );
};

    return (
        <main className="min-h-dvh flex items-center justify-center bg-black text-zinc-100">
            <div className="w-full max-w-3xl rounded-[4.5rem] border-4 border-zinc-700/60 bg-zinc-900/80 p-8 sm:p-12 flex flex-col gap-8">
                <div className="flex flex-col items-center gap-3 w-full text-center sm:flex-row sm:items-center sm:gap-4 sm:justify-center sm:text-left">
                    <img src="/favicon.ico" alt="SchoolEm" className="h-16 w-16" />
                    <h1 className="text-2xl font-semibold	sm:text-4xl">
                        Update your password
                    </h1>
                </div>
            {renderContent()}
            </div>
        </main>
    );
}