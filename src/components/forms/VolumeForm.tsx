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
import { checkProposedVolumeExists } from "@/lib/actions"; // Import the checkProposedVolumeExists function

const VolumeForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update" | "createActual";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
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
  const [existingVolume, setExistingVolume] = useState<boolean>(false); // To track if a volume exists

  // Memoize the testDate object to avoid re-creation on every render
  const testDate = useMemo(() => new Date(2025, 3, 1), []);

  // Memoize getValidQuarter to avoid re-creation on every render
  const getValidQuarter = useCallback(() => {
    const today = testDate; // Use the test date for validation
    const month = today.getMonth() + 1; // January is month 0, so adding 1
    const day = today.getDate();

    if (month === 1 && day <= 10) return "Q2"; // Jan 1-10
    if (month === 4 && day <= 10) return "Q3"; // Apr 1-10
    if (month === 7 && day <= 10) return "Q4"; // Jul 1-10
    if (month === 9 && day <= 10) {
      // September 1-10 should return Q1 of the next year
      return "Q1"; // Return Q1 of the next year
    }

    return null; // No valid quarter if not within the allowed range
  }, [testDate]);

  // Memoize getValidYear to avoid re-creation on every render
  const getValidYear = useCallback(() => {
    const today = testDate; // Use the test date for validation
    const month = today.getMonth() + 1; // January is month 0, so adding 1
    const day = today.getDate();
    const currentYear = today.getFullYear();
    const nextYear = currentYear + 1;

    const validQuarter = getValidQuarter(); // Get the valid quarter

    if (validQuarter && validQuarter.startsWith("Q1")) {
      // If the valid quarter is Q1, return the next year as a string
      return `${nextYear}`;
    }

    return `${currentYear}`; // Otherwise, return the current year as a string
  }, [getValidQuarter, testDate]);

  // Check if a volume for the given quarter and year already exists
  const checkExistingVolume = async (quarter: string, year: string) => {
    const exists = await checkProposedVolumeExists(quarter, parseInt(year)); // Use checkProposedVolumeExists
    setExistingVolume(exists);
  };

  // In useEffect
  useEffect(() => {
    setValidQuarter(getValidQuarter());
    setValidYear(getValidYear()); // `getValidYear()` now returns a string
  }, [getValidQuarter, getValidYear]);

  // Update check when quarter or year changes
  useEffect(() => {
    if (validQuarter && validYear) {
      checkExistingVolume(validQuarter, validYear);
    }
  }, [validQuarter, validYear]);

  const onSubmit = handleSubmit((data) => {
    // Prevent form submission if a volume exists for the selected quarter and year
    if (existingVolume) {
      toast("A volume for this quarter and year already exists.");
      return;
    }

    formAction(data); // Proceed with the form action if no existing volume
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
        {/* Proposed Volume */}
        <InputField
          label="Commitment Volume"
          name="committedVolume"
          defaultValue={data?.committedVolume}
          register={register}
          error={errors?.committedVolume}
          type="number"
        />
      </div>

      {/* Conditional Quarter Selection */}
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
        <div className="flex flex-col gap-2">
          <span className="text-red-500 font-medium">
            Not allowed to create volume
          </span>
        </div>
      )}

      {/* Conditional Year Selection */}
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
        <div className="flex flex-col gap-2">
          <span className="text-red-500 font-medium">
            Not allowed to create volume
          </span>
        </div>
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
            (validQuarter === null || validYear === null || existingVolume)) ||
          (type === "update" && (validQuarter === null || validYear === null))
        }
      >
        {type === "create" ? "Create Volume" : "Update Volume"}
      </button>

      {/* Show message when not allowed to create volume */}
      {(validQuarter === null || validYear === null || existingVolume) && (
        <span className="text-red-500 text-sm font-medium mt-2">
          {/* Not allowed to create volume */}
        </span>
      )}
    </form>
  );
};

export default VolumeForm;
