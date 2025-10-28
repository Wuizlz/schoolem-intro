import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { signUpWithEmail, ensureProfile } from "../src/services/apiProfile";

export function useCreateProfile() {
  const { mutate: createProfile, isLoading: isCreating } = useMutation({
    mutationFn: signUpWithEmail,
    onSuccess: async (res) => {
      if (res.requiresEmailConfirmation) {
        toast.success("Check your email to verify your account.");
        return;
      }
      // Dev mode (or confirmation disabled): we already have a session
      try {
        await ensureProfile({ displayName: res.displayName });
        toast.success("Profile created!");
      } catch (e) {
        toast.error(e.message);
        console.log(e.message)
      }
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createProfile };
}