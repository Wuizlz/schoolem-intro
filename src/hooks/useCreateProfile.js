// src/hooks/useCreateProfile.js
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { signUpWithEmail } from "../services/apiProfile";

export function useCreateProfile() {
  const { mutate: createProfile, isLoading: isCreating } = useMutation({
    mutationFn: signUpWithEmail,
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createProfile };
}
