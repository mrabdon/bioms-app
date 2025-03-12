"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect } from "react";
import { produceSchema, ProduceSchema } from "@/lib/formValidationSchemas";
import InputField from "../InputField";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { createProduce, updateProduce } from "@/lib/actions";

const ProduceForm = ({
  type,
  data,
  existingVolumes,
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
  existingVolumes?: { quarter: string; year: string }[];
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
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

  const router = useRouter();
  const actualProduction = watch("actualProduction");
  const remainingCommittedVolume = data?.remainingCommittedVolume ?? 0;

  // Function to generate month options based on the quarter
  const getMonthOptions = () => {
    switch (data?.quarter) {
      case "Q1":
        return ["January", "February", "March"];
      case "Q2":
        return ["April", "May", "June"];
      case "Q3":
        return ["July", "August", "September"];
      case "Q4":
        return ["October", "November", "December"];
      default:
        return [];
    }
  };

  const onSubmit = handleSubmit((formData) => {
    if (Number(formData.actualProduction) > remainingCommittedVolume) {
      toast.error(
        "Actual Produce Volume cannot exceed the remaining committed volume."
      );
      return;
    }
    formAction(formData);
  });

  useEffect(() => {
    if (state.success) {
      toast.success("Actual Volume has been created");
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

      {/* Remaining Committed Volume Display */}
      <div className="bg-gray-100 p-2 rounded-md text-gray-700 text-sm font-medium">
        Remaining Committed Volume:
        <span className="font-bold text-green-400 px-1">
          {remainingCommittedVolume}{" "}
        </span>
        liters
      </div>

      {/* Actual Produce Volume Input */}
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Actual Produce Volume"
          name="actualProduction"
          defaultValue={data?.actualProduction}
          register={register}
          error={errors?.actualProduction}
          type="number"
        />
        {Number(actualProduction) > remainingCommittedVolume && (
          <span className="text-red-500 text-xs">
            Cannot exceed {remainingCommittedVolume} liters.
          </span>
        )}
      </div>

      {/* Quarter Selection (Disabled) */}
      <div className="flex flex-col gap-2 ">
        <label className="text-xs text-gray-500">Quarter</label>
        <select
          className="ring-[1.5px] ring-gray-300 bg-gray-100 p-2 rounded-md text-sm w-full"
          {...register("quarter")}
          defaultValue={data?.quarter}
          disabled
        >
          {data?.quarter && (
            <option value={data.quarter}>{data.quarter}</option>
          )}
        </select>
        {errors.quarter?.message && (
          <p className="text-xs text-red-400">
            {errors.quarter.message.toString()}
          </p>
        )}
      </div>

      {/* Month Selection */}
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

      {/* Year Selection (Disabled) */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Year</label>
        <select
          className="ring-[1.5px] ring-gray-300 bg-gray-100 p-2 rounded-md text-sm w-full"
          {...register("year")}
          defaultValue={data?.year}
          disabled
        >
          {data?.year && <option value={data.year}>{data.year}</option>}
        </select>
        {errors.year?.message && (
          <p className="text-xs text-red-400">
            {errors.year.message.toString()}
          </p>
        )}
      </div>

      {/* Hidden ID Field (For Updates) */}
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

      {/* Error Message */}
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}

      {/* Submit Button */}
      <button className="bg-blue-400 text-white p-2 rounded-md">Submit</button>
    </form>
  );
};

export default ProduceForm;
