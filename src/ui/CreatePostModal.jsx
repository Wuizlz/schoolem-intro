// src/ui/CreatePostModal.jsx
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { TbPhoto } from "react-icons/tb";
import toast from "react-hot-toast";

import Button from "./Button";
import { useCreatePost } from "../hooks/useCreatePost";

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

/**
 * CreatePostModal
 * - Step 1: pick or drop media (shows thumbnails + Next button)
 * - Step 2: add caption with a large preview and share
 */
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
  } = useForm({
    defaultValues: { caption: "" },
  });

  const { createPostAsync, isCreatingPost } = useCreatePost();

  const hasSelection = mediaItems.length > 0;
  const primaryItem = mediaItems[0];

  useEffect(() => {
    mediaItemsRef.current = mediaItems;
  }, [mediaItems]);

  useEffect(() => {
    return () => {
      mediaItemsRef.current.forEach((entry) =>
        URL.revokeObjectURL(entry.previewUrl)
      );
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
      await createPostAsync({
        caption,
        mediaItems,
      });

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
      <h2 className="text-center text-2xl font-semibold text-amber-50 sm:text-3xl">
        Create new post!
      </h2>

      {step === "select" && (
        <>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`relative w-full min-h-[320px] overflow-hidden rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-800/40 ${
              hasSelection ? "p-0" : "p-8 text-center"
            }`}
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
                  <p className="text-lg font-semibold text-zinc-50">Looks great!</p>
                  <p className="text-sm text-zinc-300">
                    Drag more media to add them, or upload from your device.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="secondary"
                    buttonType="button"
                    onClick={handlePickClick}
                    className="border-yellow-500/60 text-zinc-100 hover:bg-yellow-500/20"
                  >
                    Upload more
                  </Button>
                  <Button
                    type="secondary"
                    buttonType="button"
                    onClick={() => {
                      mediaItems.forEach((entry) =>
                        URL.revokeObjectURL(entry.previewUrl)
                      );
                      setMediaItems([]);
                      reset({ caption: "" });
                    }}
                    className="border-transparent bg-zinc-800/70 text-zinc-300 hover:bg-zinc-700/70"
                  >
                    Clear selection
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="mb-3 text-lg text-zinc-200">
                  Cherish and remember your moments! ✨
                </p>

                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-zinc-700/60">
                  <TbPhoto className="h-full w-full text-amber-50" />
                </div>

                <p className="mb-4 text-xl font-semibold text-amber-50">
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

            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleInputChange}
            />

            {hasSelection && (
              <div className="mt-6 text-left">
                <p className="mb-3 text-sm font-medium text-zinc-300">Selected media</p>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {mediaItems.map(({ id, previewUrl, kind, file }) => (
                    <li
                      key={id}
                      className="relative aspect-square overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800"
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
          <div className="overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-800">
            {primaryItem.kind === "video" ? (
              <video
                src={primaryItem.previewUrl}
                className="max-h-[420px] w-full object-contain"
                controls
                playsInline
              />
            ) : (
              <img
                src={primaryItem.previewUrl}
                alt={primaryItem.file.name}
                className="max-h-[420px] w-full object-contain"
              />
            )}
          </div>

          <div className="flex w-full flex-col gap-4">
            <label className="text-sm font-semibold uppercase tracking-wide text-zinc-300">
              Caption
            </label>
            <textarea
              {...register("caption", {
                required: "Please add a caption before sharing.",
                minLength: {
                  value: 3,
                  message: "Caption must be at least 3 characters.",
                },
              })}
              placeholder="Write something about this moment..."
              rows={5}
              className="w-full resize-none rounded-2xl border border-zinc-700 bg-zinc-800 p-4 text-base text-zinc-100 placeholder:text-zinc-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
            />
            {errors.caption && (
              <p className="text-sm font-medium text-red-400">
                {errors.caption.message}
              </p>
            )}

            <div className="flex items-center justify-between gap-3">
              <Button type="secondary" buttonType="button" onClick={handleBack}>
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
