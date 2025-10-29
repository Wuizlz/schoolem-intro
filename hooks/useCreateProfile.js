import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { signUpWithEmail } from "../src/services/apiProfile";

export function useCreateProfile() {
  const { mutate: createProfile, isLoading: isCreating } = useMutation({
    mutationFn: signUpWithEmail,
    onSuccess: (result) => {
      if (result.profileError) {
        toast.error(result.profileError.message);
        return;
      }
      if (result.emailConfirmation) {
        toast.success("Check your email to verify your account.");
        return;
      }

      toast.success("Profile created!");
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createProfile };
}
