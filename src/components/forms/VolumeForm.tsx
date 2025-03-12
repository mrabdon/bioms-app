"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { volumeSchema, VolumeSchema } from "@/lib/formValidationSchemas";
import InputField from "../InputField";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { createVolume, updateVolume } from "@/lib/actions";

const VolumeForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type:
    | "create"
    | "update"
    | "invite"
    | "createProduce"
    | "createSold"
    | "createLift";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VolumeSchema>({
    resolver: zodResolver(volumeSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createVolume : updateVolume,
    {
      success: false,
      error: false,
    }
  );

  const [existingVolume, setExistingVolume] = useState<boolean>(false);
  const router = useRouter();

  // Generate list of years from 2016 to present
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2016 + 1 },
    (_, i) => 2016 + i
  );

  // Available quarters
  const quarters = ["Q1", "Q2", "Q3", "Q4"];

  const onSubmit = handleSubmit((formData) => {
    if (existingVolume) {
      toast(
        "A volume for this quarter and year already exists for this producer."
      );
      return;
    }
    formAction({ ...formData });
  });

  useEffect(() => {
    if (state.success) {
      toast.success(
        `Volume has been ${type === "create" ? "created" : "updated"}`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create Proposed/Committed Volume"
          : "Update Proposed/Committed Volume"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Specify the commitment volume for the upcoming quarter
      </span>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Commitment Volume"
          name="committedVolume"
          defaultValue={data?.committedVolume}
          register={register}
          error={errors?.committedVolume}
          type="number"
        />
      </div>

      {/* Quarter Selection */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Quarter</label>
        <select
          {...register("quarter")}
          defaultValue={data?.quarter ?? "Q1"}
          className="p-2 border rounded-md"
        >
          {quarters.map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
        {errors?.quarter && (
          <span className="text-red-500 text-xs">{errors.quarter.message}</span>
        )}
      </div>

      {/* Year Selection */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Year</label>
        <select
          {...register("year")}
          defaultValue={data?.year ?? currentYear} // Default to the current year
          className="p-2 border rounded-md"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        {errors?.year && (
          <span className="text-red-500 text-xs">{errors.year.message}</span>
        )}
      </div>

      {data && (
        <InputField
          label="Id"
          name="id"
          defaultValue={data?.id}
          register={register}
          error={errors?.id}
          hidden
          className="w-full"
        />
      )}

      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}

      <button className={`bg-blue-400 text-white p-2 rounded-md`}>
        {type === "create" ? "Create Volume" : "Update Volume"}
      </button>
    </form>
  );
};

export default VolumeForm;
