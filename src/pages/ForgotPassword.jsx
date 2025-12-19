// src/pages/ForgotPassword.jsx
import { useForm } from "react-hook-form";
import Button from "../ui/ui components/Button";
import Input from "../ui/ui components/Input";
import usePasswordReset from "../services/passwordReset";

export default function ForgotPassword() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: { email: "" },
    });

    const { sendResetEmail } = usePasswordReset();

    const onSubmit = async ({ email }) => {
        const result = await sendResetEmail({ email});
        if (result?.ok) reset();
    };

    return (
        <main className="min-h-dvh flex items-center justify-center bg-black text-zinc-100">
            <div className="w-full max-w-3xl rounded-[4.5rem] border-4 border-zinc-700/60 bg-zinc-900/80 p-8 sm:p-12 flex flex-col gap-8">
                <div className="flex flex-col items-center gap-3 w-full text-center sm:flex-row sm:items-center sm:gap-4 sm:justify-center sm:text-left">
                    <img src="/favicon.ico" alt="SchoolEm" className="h-16 w-16" />
                    <h1 className="text-2xl font-semibold	sm:text-4xl">
                        Forgot your password?
                    </h1>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <p className="text-sm text-center text-zinc-300">
                        Enter the email linked to your account and we will email you reset
                        instructions.
                    </p>

                    <Input
                        id="reset-email"
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

                    <div className="flex flex-col items-center gap-3">
                        <Button
                            type="primary"
                            buttonType="submit"
                            className="self-center"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Sending Reset Link..." : "Send Reset Link"}
                        </Button>

                        <Button type="modalButtonAlternative" to="/signin" 
                            className="text-sm font-semibold text-yellow-400 hover:text-yellow-300 
                                hover:underline disabled:cursor-not-allowed disabled:opacity-60">
                            Remember password?
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    );
}
