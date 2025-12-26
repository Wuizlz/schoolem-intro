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
  const [textCount, setTextCount] = useState(0);
  const [showButton, setShowButton] = useState(false);

  const { createThreadAsync, isCreatingThread } = useCreateThread();

  useEffect(() => {
    setShowButton(text.length >= 3 && text.length <= 1000);
    if (text.length <= 1000) {
      setTextCount((count) => (count = text.length));
    }
  }, [text]);

  async function onSubmit(formValues) {
    const { thread_text } = formValues;
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
        <header className=" text-2xl font-semibold text-amber-50 sm:text-3xl">
          Let others know whats up!
        </header>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          placeholder="Whats up?"
          rows={8}
          maxLength={1000}
          className="w-full  border focus:ring-amber-50  resize-none rounded-2xl text-center my-5  p-1 text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none "
          {...register("thread_text", {
            required: "Please add a caption before sharing.",
            minLength: {
              value: 3,
              message: "Caption must be at least 3 characters.",
            },
            maxLength: {
              value: 1000,
              message: "Message too long, max 1000 characters ",
            },
          })}
        />
        <p className="text-[var(--color-grey-200)]">{textCount + "/1000"}</p>
        {errors.thread_text && (
          <p id="thread_text_error" className="mt-2 text-sm text-red-400">
            {errors.thread_text.message}
          </p>
        )}
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
