"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { volumeSchema, VolumeSchema } from "@/lib/formValidationSchemas";
import InputField from "../InputField";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { createVolume, updateVolume } from "@/lib/actions";
import { checkProposedVolumeExists } from "@/lib/actions"; // Import check function

const VolumeForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update" | "createProduce" | "createSold";
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

  const [validQuarter, setValidQuarter] = useState<string | null>(null);
  const [validYear, setValidYear] = useState<string | null>(null);
  const [existingVolume, setExistingVolume] = useState<boolean>(false);

  // Memoized test date (modify as needed)
  const testDate = useMemo(() => new Date(2025, 3, 1), []);

  // Determine valid quarter
  const getValidQuarter = useCallback(() => {
    const today = testDate;
    const month = today.getMonth() + 1;
    const day = today.getDate();

    if (month === 1 && day <= 10) return "Q2";
    if (month === 4 && day <= 10) return "Q3";
    if (month === 7 && day <= 10) return "Q4";
    if (month === 9 && day <= 10) return "Q1";

    return null;
  }, [testDate]);

  // Determine valid year
  const getValidYear = useCallback(() => {
    const today = testDate;
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const currentYear = today.getFullYear();
    const nextYear = currentYear + 1;

    const validQuarter = getValidQuarter();
    return validQuarter?.startsWith("Q1") ? `${nextYear}` : `${currentYear}`;
  }, [getValidQuarter, testDate]);

  // Check if a volume exists for the current producer
  const checkExistingVolume = async (quarter: string, year: string) => {
    const exists = await checkProposedVolumeExists(quarter, parseInt(year, 10));
    setExistingVolume(exists);
  };

  useEffect(() => {
    setValidQuarter(getValidQuarter());
    setValidYear(getValidYear());
  }, [getValidQuarter, getValidYear]);

  useEffect(() => {
    if (validQuarter && validYear) {
      checkExistingVolume(validQuarter, validYear);
    }
  }, [validQuarter, validYear]); // Include producerId in dependencies

  const onSubmit = handleSubmit((formData) => {
    if (existingVolume) {
      toast(
        "A volume for this quarter and year already exists for this producer."
      );
      return;
    }

    formAction({ ...formData });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Volume has been ${type === "create" ? "created" : "updated"}`);
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
      {validQuarter ? (
        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm">Quarter</label>
          <select
            {...register("quarter")}
            defaultValue={data?.quarter}
            className="p-2 border rounded-md"
          >
            <option value={validQuarter}>{validQuarter}</option>
          </select>
          {errors?.quarter && (
            <span className="text-red-500 text-xs">
              {errors.quarter.message}
            </span>
          )}
        </div>
      ) : (
        <span className="text-red-500 font-medium">
          Not allowed to create volume
        </span>
      )}

      {/* Year Selection */}
      {validYear ? (
        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm">Year</label>
          <select
            {...register("year")}
            defaultValue={data?.year}
            className="p-2 border rounded-md"
          >
            <option value={validYear}>{validYear}</option>
          </select>
          {errors?.year && (
            <span className="text-red-500 text-xs">{errors.year.message}</span>
          )}
        </div>
      ) : (
        <span className="text-red-500 font-medium">
          Not allowed to create volume
        </span>
      )}

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

      <button
        className={`${
          (type === "create" && validQuarter && validYear && !existingVolume) ||
          (type === "update" && validQuarter && validYear)
            ? "bg-blue-400"
            : "bg-gray-400"
        } text-white p-2 rounded-md`}
        disabled={
          (type === "create" &&
            (!validQuarter || !validYear || existingVolume)) ||
          (type === "update" && (!validQuarter || !validYear))
        }
      >
        {type === "create" ? "Create Volume" : "Update Volume"}
      </button>
    </form>
  );
};

export default VolumeForm;
