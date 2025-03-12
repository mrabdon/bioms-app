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
import { produceSchema, ProduceSchema } from "@/lib/formValidationSchemas";
import InputField from "../InputField";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { createProduce, updateProduce } from "@/lib/actions";

const ProduceForm = ({
  type,
  data,
  remainingVolume,
  existingVolumes,
  setOpen,
}: {
  type:
    | "create"
    | "update"
    | "invite"
    | "createProduce"
    | "createSold"
    | "createLift";
  data?: any;
  remainingVolume: number;
  existingVolumes?: { quarter: string; year: string }[];
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProduceSchema>({
    resolver: zodResolver(produceSchema),
  });

  const [state, formAction] = useFormState(
    type === "createProduce" ? createProduce : updateProduce,
    {
      success: false,
      error: false,
    }
  );

  const [validQuarter, setValidQuarter] = useState<string | null>(null);
  const [validYear, setValidYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>(""); // Store validation error message
  // Memoize testDate to prevent it from being recreated on every render
  const testDate = new Date(2025, 9, 1); // Example: January 14, 2024

  // Wrap getValidQuarter in useCallback to avoid it being recreated on every render
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

  // Wrap getValidYear in useCallback to avoid it being recreated on every render
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

  // Function to generate month options based on the quarter
  const getMonthOptions = () => {
    if (data?.quarter === "Q1") {
      return ["January", "February", "March"];
    }
    if (data?.quarter === "Q2") {
      return ["April", "May", "June"];
    }
    if (data?.quarter === "Q3") {
      return ["July", "August", "September"];
    }
    if (data?.quarter === "Q4") {
      return ["October", "November", "December"];
    }
    return [];
  };

  // In useEffect
  useEffect(() => {
    setValidQuarter(getValidQuarter());
    setValidYear(getValidYear()); // `getValidYear()` now returns a string
  }, [getValidQuarter, getValidYear]); // Added dependencies here

  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(
        `Actual Volume has been ${type === "create" ? "created" : "created"}`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "createProduce"
          ? "Create Actual Produce Volume"
          : "Update Actual Produce Volume"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Specify the actual production volume for the upcoming quarter
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        {/* Proposed Volume */}
        <InputField
          label="Actual Produce Volume"
          name="actualProduction"
          defaultValue={data?.actualProduction}
          register={register}
          error={errors?.actualProduction}
          type="number"
        />
      </div>

      {/* Conditional Quarter Selection */}

      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Quarter</label>
        <select
          {...register("quarter")}
          defaultValue={data?.quarter}
          className="p-2 border rounded-md"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Month</label>
        <select
          {...register("month")}
          defaultValue={data?.month}
          className="p-2 border rounded-md"
        >
          {getMonthOptions().map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
        </select>
        {errors?.month && (
          <span className="text-red-500 text-xs">{errors.month.message}</span>
        )}
      </div>

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
          validQuarter ? "bg-blue-400" : "bg-gray-400"
        } text-white p-2 rounded-md`}
        disabled={validQuarter === null} // Disable button if no valid quarter
      >
        {type === "create" ? "Create Volume" : "Submit"}
      </button>
    </form>
  );
};

export default ProduceForm;
