// src/ui/CreatePostModal.jsx
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { TbPhoto } from "react-icons/tb";
import toast from "react-hot-toast";

import Button from "../ui components/Button";
import { useCreatePost } from "../../hooks/useCreatePost";
import Input from "../ui components/Input";

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createMediaEntry(file) {
  return {
    file,
    previewUrl: URL.createObjectURL(file),
    kind: file.type.startsWith("video") ? "video" : "image",
    id: generateId(),
  };
}

export default function CreatePostModal({ onCloseModal }) {
  const inputRef = useRef(null);
  const mediaItemsRef = useRef([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [step, setStep] = useState("select");

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { caption: "" } });

  const { createPostAsync, isCreatingPost } = useCreatePost();

  const hasSelection = mediaItems.length > 0;
  const primaryItem = mediaItems[0];

  useEffect(() => {
    mediaItemsRef.current = mediaItems;
  }, [mediaItems]);

  useEffect(() => {
    return () => {
      mediaItemsRef.current.forEach((entry) => URL.revokeObjectURL(entry.previewUrl));
    };
  }, []);

  function handlePickClick() {
    inputRef.current?.click();
  }

  function addSelectedFiles(fileList) {
    const accepted = fileList.filter((file) => /^image|video\//.test(file.type));
    if (!accepted.length) return;

    const entries = accepted.map(createMediaEntry);
    setMediaItems((prev) => [...prev, ...entries]);
  }

  function handleInputChange(e) {
    const list = Array.from(e.target.files || []);
    addSelectedFiles(list);
    e.target.value = "";
  }

  function handleDrop(e) {
    e.preventDefault();
    const list = Array.from(e.dataTransfer.files || []);
    addSelectedFiles(list);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleNext() {
    if (!hasSelection) {
      toast.error("Please add at least one photo or video first.");
      return;
    }
    setStep("details");
  }

  function handleBack() {
    setStep("select");
  }

  async function onSubmit(formValues) {
    if (!hasSelection) {
      toast.error("Please add at least one photo or video first.");
      return;
    }

    const caption = formValues.caption ?? getValues("caption");

    try {
      await createPostAsync({ caption, mediaItems });

      mediaItems.forEach((entry) => URL.revokeObjectURL(entry.previewUrl));
      setMediaItems([]);
      reset({ caption: "" });
      setStep("select");
      onCloseModal?.();
    } catch (err) {
      // toast handled in mutation hook
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <h2 className="text-center text-2xl font-semibold text-[var(--color-grey-900)] sm:text-3xl">
        Create new post!
      </h2>

      {step === "select" && (
        <>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`relative w-full min-h-[320px] overflow-hidden rounded-2xl border-2 border-dashed
              ${hasSelection ? "p-0" : "p-8 text-center"}
              border-[var(--color-grey-200)] bg-[var(--color-grey-50)]`}
          >
            {hasSelection && primaryItem && (
              <>
                {primaryItem.kind === "video" ? (
                  <video
                    src={primaryItem.previewUrl}
                    className="absolute inset-0 h-full w-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={primaryItem.previewUrl}
                    alt={primaryItem.file.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </>
            )}

            {hasSelection ? (
              <div className="relative z-10 flex h-full flex-col justify-end gap-4 p-6 text-left">
                <div>
                  <p className="text-lg font-semibold text-white">Looks great!</p>
                  <p className="text-sm text-white/80">
                    Drag more media to add them, or upload from your device.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    buttonType="button"
                    onClick={handlePickClick}
                    className="bg-[var(--color-grey-0)]/85 text-[var(--color-grey-900)] border border-[var(--color-grey-200)] hover:bg-[var(--color-grey-0)]"
                  >
                    Upload more
                  </Button>

                  <Button
                    buttonType="button"
                    onClick={() => {
                      mediaItems.forEach((entry) => URL.revokeObjectURL(entry.previewUrl));
                      setMediaItems([]);
                      reset({ caption: "" });
                    }}
                    className="bg-[var(--color-grey-0)]/70 text-[var(--color-grey-700)] border border-transparent hover:bg-[var(--color-grey-100)]"
                  >
                    Clear selection
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="mb-3 text-lg text-[var(--color-grey-500)]">
                  Cherish and remember your moments! ✨
                </p>

                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--color-grey-0)] border border-[var(--color-grey-200)]">
                  <TbPhoto className="h-9 w-9 text-[var(--color-grey-500)]" />
                </div>

                <p className="mb-4 text-xl font-semibold text-[var(--color-grey-700)]">
                  Drag photos and videos here
                </p>

                <Button
                  type="primary"
                  buttonType="button"
                  onClick={handlePickClick}
                  className="mx-auto block px-6 py-4 text-lg font-extrabold"
                >
                  Upload from device
                </Button>
              </>
            )}

            <Input
              ref={inputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleInputChange}
            />

            {hasSelection && (
              <div className="mt-6 px-6 pb-6 text-left relative z-10">
                <p className="mb-3 text-sm font-medium text-white/80">
                  Selected media
                </p>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {mediaItems.map(({ id, previewUrl, kind, file }) => (
                    <li
                      key={id}
                      className="relative aspect-square overflow-hidden rounded-xl border border-white/20 bg-black/20"
                    >
                      {kind === "video" ? (
                        <video
                          src={previewUrl}
                          className="h-full w-full object-cover"
                          muted
                          playsInline
                        />
                      ) : (
                        <img
                          src={previewUrl}
                          alt={file.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {hasSelection && (
            <div className="flex w-full justify-end">
              <Button type="primary" buttonType="button" onClick={handleNext}>
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {step === "details" && primaryItem && (
        <form onSubmit={handleSubmit(onSubmit)} className="grid w-full gap-6">
          <div className="overflow-hidden rounded-2xl w-full border border-[var(--color-grey-200)] bg-[var(--color-grey-50)]">
            {primaryItem.kind === "video" ? (
              <video
                src={primaryItem.previewUrl}
                className="max-h-[50vh] w-full object-contain"
                controls
                playsInline
              />
            ) : (
              <img
                src={primaryItem.previewUrl}
                alt={primaryItem.file.name}
                className="max-h-[40vh] w-full object-contain"
              />
            )}
          </div>

          <div className="flex w-full flex-col gap-4">
            <textarea
              {...register("caption", {
                required: "Please add a caption before sharing.",
                minLength: { value: 3, message: "Caption must be at least 3 characters." },
              })}
              placeholder="Write something about this moment..."
              rows={3}
              className="w-full resize-none rounded-2xl border border-[var(--color-grey-200)] bg-[var(--color-grey-0)] p-3 text-base text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-500)] focus:outline-none focus:ring-2 focus:ring-amber-400"
            />

            {errors.caption && (
              <p className="text-sm font-medium text-red-500">
                {errors.caption.message}
              </p>
            )}

            <div className="flex items-center justify-between gap-3">
              <Button
                buttonType="button"
                onClick={handleBack}
                className="bg-[var(--color-grey-0)] text-[var(--color-grey-900)] border border-[var(--color-grey-200)] hover:bg-[var(--color-grey-100)]"
              >
                Back
              </Button>

              <Button
                type="primary"
                buttonType="submit"
                disabled={isCreatingPost || isSubmitting}
              >
                {isCreatingPost || isSubmitting ? "Sharing…" : "Share"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}