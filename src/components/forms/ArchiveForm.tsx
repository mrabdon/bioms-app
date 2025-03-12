"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
  announcementSchema,
  AnnouncementSchema,
  volumeSchema,
  VolumeSchema,
} from "@/lib/formValidationSchemas";
import {
  archiveVolume,
  createAnnouncement,
  updateAnnouncement,
  updateVolume,
} from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ArchiveForm = ({
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
    | "createLift"
    | "archive";
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

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE

  const [state, formAction] = useFormState(
    type === "archive" ? archiveVolume : updateVolume,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Volume has been archived`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  // const { producers } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Are you sure to archived?</h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Archive"
          name="archive"
          defaultValue={data?.archived}
          register={register}
          error={errors?.archived}
        />

        {/* <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Producer</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("producers")}
            defaultValue={data?.producers}
          >
            {producers.map((producers: { id: string; name: string }) => (
              <option value={producers.id} key={producers.id}>
                {producers.name}
              </option>
            ))}
          </select>
          {errors.producers?.message && (
            <p className="text-xs text-red-400">
              {errors.producers.message.toString()}
            </p>
          )}
        </div> */}

        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ArchiveForm;
