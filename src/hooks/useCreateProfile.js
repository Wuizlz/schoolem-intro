// src/hooks/useCreateProfile.js
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { signUpWithEmail } from "../services/apiProfile";

export function useCreateProfile() {
  const {
    mutate,
    mutateAsync,
    isLoading,
    isPending,
  } = useMutation({
    mutationFn: signUpWithEmail,
    onSuccess: (result) => {
      if (result?.profileError) {
        toast.error(result.profileError.message);
        return;
      }
      if (result?.emailConfirmation) {
        toast.success("Check your email to verify your account.");
        return;
      }
      toast.success("Profile created!");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to create profile");
    },
  });

  return {
    isCreating: Boolean(isLoading || isPending),
    createProfile: mutate,
    createProfileAsync: mutateAsync,
  };
}
