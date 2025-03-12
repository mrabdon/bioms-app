"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useCallback,
} from "react";
import { volumeSchema, VolumeSchema } from "@/lib/formValidationSchemas";
import InputField from "../InputField";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import {
  createVolume,
  updateVolume,
  checkProposedVolumeExists,
} from "@/lib/actions";

const ALLOWED_CREATION_DAYS = 10;

const VolumeForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: { companies: string[] }; // Updated to handle multiple companies
}) => {
  const router = useRouter();
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
  const companyIds = relatedData?.companies || []; // Ensure we have an array of company IDs

  // Determine valid quarter
  const getValidQuarter = useCallback((): string | null => {
    const today = new Date(2025, 3, 1);
    const month = today.getMonth() + 1;
    const day = today.getDate();

    if (day > ALLOWED_CREATION_DAYS) return null; // Not allowed after 10 days

    const quarterMap: Record<number, string> = {
      1: "Q2",
      4: "Q3",
      7: "Q4",
      10: "Q1",
    };

    return quarterMap[month] || null;
  }, []);

  // Determine valid year
  const getValidYear = useCallback((): string | null => {
    const today = new Date();
    const currentYear = today.getFullYear();
    return validQuarter === "Q1"
      ? (currentYear + 1).toString()
      : currentYear.toString();
  }, [validQuarter]);

  // Check if volume exists for any of the associated companies
  const checkExistingVolume = useCallback(async () => {
    if (!validQuarter || !validYear || companyIds.length === 0) return;

    const exists = await checkProposedVolumeExists(
      validQuarter,
      parseInt(validYear),
      companyIds
    );
    setExistingVolume(exists);
  }, [validQuarter, validYear, companyIds]);

  useEffect(() => {
    setValidQuarter(getValidQuarter());
  }, [getValidQuarter]);

  useEffect(() => {
    setValidYear(getValidYear());
  }, [validQuarter, getValidYear]);

  useEffect(() => {
    checkExistingVolume();
  }, [validQuarter, validYear, checkExistingVolume]);

  useEffect(() => {
    if (state.success) {
      toast(`Volume has been ${type === "create" ? "created" : "updated"}`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const isFormAllowed = validQuarter && validYear && !existingVolume;

  const onSubmit = handleSubmit((formData) => {
    if (!isFormAllowed) {
      toast.error("You are not allowed to create a volume at this time.");
      return;
    }
    formAction({
      ...formData,
      quarter: validQuarter,
      year: validYear,
      companies: companyIds,
    });
  });

  return (
    <div className="p-4 border rounded-md shadow-md">
      <h1 className="text-xl font-semibold mb-2">
        {type === "create"
          ? "Create Proposed/Committed Volume"
          : "Update Proposed/Committed Volume"}
      </h1>

      {!isFormAllowed ? (
        <div className="text-red-500 font-medium text-center p-4 border border-red-300 rounded-md bg-red-100">
          {existingVolume
            ? "A volume entry for this quarter already exists for one or more associated companies."
            : "Volume creation is only allowed within the first 10 days of the quarter."}
        </div>
      ) : (
        <form className="flex flex-col gap-6 mt-4" onSubmit={onSubmit}>
          <span className="text-xs text-gray-400 font-medium">
            Specify the commitment volume for the upcoming quarter
          </span>

          <InputField
            label="Commitment Volume"
            name="committedVolume"
            defaultValue={data?.committedVolume}
            register={register}
            error={errors.committedVolume}
            type="number"
          />

          {/* Quarter Selection */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm">Quarter</label>
            <input
              type="text"
              value={validQuarter}
              readOnly
              className="p-2 border rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Year Selection */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm">Year</label>
            <input
              type="text"
              value={validYear}
              readOnly
              className="p-2 border rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          {data && (
            <InputField
              label="Id"
              name="id"
              defaultValue={data?.id}
              register={register}
              error={errors.id}
              hidden
            />
          )}

          {state.error && (
            <span className="text-red-500">Something went wrong!</span>
          )}

          <button
            className="bg-blue-400 text-white p-2 rounded-md"
            type="submit"
          >
            {type === "create" ? "Create Volume" : "Update Volume"}
          </button>
        </form>
      )}
    </div>
  );
};

export default VolumeForm;
