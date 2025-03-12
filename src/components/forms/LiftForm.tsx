"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { liftSchema, LiftSchema } from "@/lib/formValidationSchemas";
import { createLift, updateLift } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const LiftForm = ({
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
    watch,
  } = useForm<LiftSchema>({
    resolver: zodResolver(liftSchema),
  });

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE

  const [state, formAction] = useFormState(
    type === "createLift" ? createLift : updateLift,
    {
      success: false,
      error: false,
    }
  );

  const router = useRouter();
  const liftVolume = watch("liftVolume");
  const remainingSoldVolume = data?.remainingSoldVolume ?? 0;

  // const onSubmit = handleSubmit((data) => {
  //   console.log(data);
  //   formAction(data);
  // });

  const onSubmit = handleSubmit((formData) => {
    if (Number(formData.liftVolume) > remainingSoldVolume) {
      toast.error("Lift Volume cannot exceed the remaining sold volume.");
      return;
    }
    formAction(formData);
  });

  useEffect(() => {
    if (state.success) {
      toast(`Lift has been ${type === "createLift" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { sold } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "createLift" ? "Create a new lift" : "Update the lift"}
      </h1>
      {/* Remaining Committed Volume Display */}
      <div className="bg-gray-100 p-2 rounded-md text-gray-700 text-sm font-medium">
        Remaining Sold Volume:
        <span className="font-bold text-green-400 px-1">
          {remainingSoldVolume}{" "}
        </span>
        liters
      </div>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Volume to Lift"
          name="liftVolume"
          defaultValue={data?.liftVolume}
          register={register}
          error={errors?.liftVolume}
          type="number"
        />
        {Number(liftVolume) > remainingSoldVolume && (
          <span className="text-red-500 text-xs">
            Cannot exceed {remainingSoldVolume} liters.
          </span>
        )}
      </div>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Region"
          name="region"
          defaultValue={data?.region}
          register={register}
          error={errors?.region}
        />
      </div>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Remark"
          name="remark"
          defaultValue={data?.remark}
          register={register}
          error={errors?.remark}
          type="textarea"
        />
      </div>
      <div className="flex justify-between flex-wrap gap-4">
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
        {type === "createLift" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default LiftForm;
