import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import { useCreateProfile } from "../hooks/useCreateProfile";

export default function DateAndGenderFrom({ initialData, onSuccess, onBack }) {
  const { createProfile, isCreating } = useCreateProfile();
  const {
    register,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: { birthdate: "", gender: "", genderOther: "" },
  });

  useEffect(() => {
    if (!initialData) return;

    reset({
      birthdate: initialData.birthdate ?? "",
      gender: initialData.gender ?? "",
      genderOther: initialData.genderOther ?? "",
    });
  }, [initialData, reset]);

  const gender = watch("gender");
  // Helpers for date bounds (min/max)
  const today = new Date();
  const minAgeYears = 18; // require at least 18 years old
  const maxAgeYears = 31; // reasonable upper bound
  const toYmd = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  const maxDOB = new Date(
    today.getFullYear() - minAgeYears,
    today.getMonth(),
    today.getDate()
  );
  const minDOB = new Date(
    today.getFullYear() - maxAgeYears,
    today.getMonth(),
    today.getDate()
  );

  function handleFormSubmit(values) {
    if (!initialData) return;

    const { confirmPassword, ...accountData } = initialData;

    const normalizedGender =
      values.gender === "other" ? values.genderOther.trim() : values.gender;

    const payload = {
      ...accountData,
      birthdate: values.birthdate,
      gender: normalizedGender,
      ...(values.gender === "other" && {
        genderLabel: values.genderOther.trim(),
      }),
    };

    createProfile(payload, {
      onSuccess: (result) => {
        onSuccess?.(result, payload);
      },
    });
  }
  return (
    <div className="w-full max-w-3xl rounded-[4.5rem] border-4 border-zinc-700/60 bg-zinc-900/80 p-8 sm:p-12 flex flex-col gap-8">
      <div className="flex flex-col items-center gap-3 w-full text-center sm:flex-row sm:items-center sm:gap-4 sm:justify-center sm:text-left">
        <img src="/favicon.ico" alt="SchoolEm" className="h-16 w-16" />

        <h3 className="text-2xl font-semibold sm:text-4xl">
          Additional Information required
        </h3>
      </div>
      <form className="w-full" onSubmit={handleSubmit(handleFormSubmit)}>
        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            {/*Birthdate */}
            <label
              htmlFor="birthdate"
              className="text-base sm:text-lg font-medium"
            >
              Birthdate:
            </label>
            <Input
              id="birthdate"
              type="date"
              className="scheme-dark"
              min={toYmd(minDOB)}
              max={toYmd(maxDOB)}
              aria-invalid={!!errors.birthdate}
              aria-describedby={
                errors.birthdate ? "birthdate-error" : undefined
              }
              error={errors.birthdate}
              {...register("birthdate", {
                validate: (value) => {
                  const d = new Date(value);
                  if (isNaN(d)) return "Invalid date.";
                  if (d > maxDOB) return "You must be at least 13 years old.";
                  if (d < minDOB) return "Please enter a valid birthdate.";
                  return true;
                },
              })}
            />
            {errors.birthdate && (
              <p id="birthdate-error" className="text-sm text-red-400">
                {errors.birthdate.message}
              </p>
            )}
            <p className="text-xs text-zinc-400 ">
              We don't show you exact birthday publicly
            </p>
          </div>

          {/*Gender */}

          <div className="flex flex-col gap-2  ">
            <label
              htmlFor="gender"
              className="text-base sm:text-lg font-medium "
            >
              Gender:
            </label>
            <select
              id="gender"
              className="w-full rounded-full border px-4 py-4 text-lg bg-zinc-900 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 border-zinc-600/70 focus:ring-white/30 [color-scheme:dark]"
              aria-invalid={!!errors.gender}
              aria-describedby={errors.gender ? "gender-error" : undefined}
              {...register("gender", {
                required: "Please select an option.",
              })}
            >
              <option value="" disabled>
                Select...
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non_binary">Non-binary</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p id="gender-error" className="text-sm text-red-400">
                {errors.gender.message}
              </p>
            )}
            {gender === "other" && (
              <div className="mt-2">
                <label
                  htmlFor="genderOther"
                  className="text-sm font-medium text-zinc-200"
                >
                  Please specify
                </label>
                <Input
                  id="genderOther"
                  type="text"
                  placeholder="Type your identity"
                  aria-invalid={!!errors.genderOther}
                  aria-describedby={
                    errors.genderOther ? "genderOther-error" : undefined
                  }
                  {...register("genderOther", {
                    required: "Please specify your gender.",
                    validate: (v) =>
                      v.trim().length > 1 ||
                      "Please enter at least 2 characters",
                  })}
                />
                {errors.genderOther && (
                  <p id="genderOther-error" className="text-sm text-red-400">
                    {errors.genderOther.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </fieldset>
        {/*Actions*/}
        <div className="mt-10 flex items-center justify-end gap-4">
          {onBack && (
            <Button type="button" onClick={onBack} className="px-6">
              Back
            </Button>
          )}
          <Button
            type="primary"
            buttonType="submit"
            disabled={isSubmitting || isCreating}
          >
            {isSubmitting || isCreating ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
