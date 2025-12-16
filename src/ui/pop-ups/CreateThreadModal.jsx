import Input from "../ui components/Input";
import { useForm } from "react-hook-form";
import Button from "../ui components/Button";
import { useEffect, useState } from "react";
import { useCreateThread } from "../../hooks/useCreateThread";

export default function CreateThreadForm({ onCloseModal }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
    reset,
  } = useForm();
  const text = watch("thread_text") || "";
  const [showButton, setShowButton] = useState(false);

  const { createThreadAsync, isCreatingThread } = useCreateThread();

  useEffect(() => {
    setShowButton(text.length >= 3);
  }, [text]);

  async function onSubmit(formValues) {
    const { thread_text } = formValues;
    console.log(thread_text);
    try {
      await createThreadAsync(thread_text);
      reset({ thread_text: "" });
      onCloseModal?.();
    } catch (err) {
      //handled from toast
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-center w-full">
        <header className=" text-2xl font-semibold text-[var(--color-grey-700)] sm:text-3xl">
          Let others know whats up!
        </header>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          {...register("thread_text", {
            required: "Please add a caption before sharing.",
            minLength: {
              value: 3,
              message: "Caption must be at least 3 characters.",
            },
          })}
          placeholder="Whats up?"
          rows={2}
          className="w-full  focus:border focus:ring-amber-50  resize-none rounded-2xl text-center my-5  p-1 text-base text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-900)]0 focus:outline-none "
        />
        {showButton && (
          <div className="flex justify-end">
            <Button
              type="primary"
              buttonType="submit"
              disabled={isCreatingThread || isSubmitting}
            >
              {isCreatingThread || isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
