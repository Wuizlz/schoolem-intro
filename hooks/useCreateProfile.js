import {useMutation, useQueryClient} from "@tanstack/react-query"
import { signUpWithEmail } from "../src/services/apiProfile"
import toast from "react-hot-toast"

export function useCreateProfile()
{
    const {mutate: createProfile, isLoading: isCreating} = useMutation({
        mutationFn: signUpWithEmail,
        onSuccess: ()=> {
            toast.success("Profile Created!");

        },
        onError: (err) => toast.error(err.message),
    });

    return {isCreating, createProfile}
}