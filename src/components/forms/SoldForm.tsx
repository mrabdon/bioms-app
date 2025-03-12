"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect } from "react";
import { soldSchema, SoldSchema } from "@/lib/formValidationSchemas";
import InputField from "../InputField";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { createSold, updateSold } from "@/lib/actions";

const SoldForm = ({
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
  } = useForm<SoldSchema>({
    resolver: zodResolver(soldSchema),
  });

  const [state, formAction] = useFormState(
    type === "createSold" ? createSold : updateSold,
    {
      success: false,
      error: false,
    }
  );
  // const onSubmit = handleSubmit((data) => {
  //   formAction(data);
  // });
  const router = useRouter();
  const soldAmount = watch("soldAmount");
  const remainingProduceVolume = data?.remainingProduceVolume ?? 0;

  const onSubmit = handleSubmit((formData) => {
    if (Number(formData.soldAmount) > remainingProduceVolume) {
      toast.error("Sell amount cannot exceed the remaining committed volume.");
      return;
    }
    formAction(formData);
  });

  useEffect(() => {
    if (state.success) {
      toast.success("Sell has been created");
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { consumers, producers, produces } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "createSold" ? "Sold to" : "Update Sold to"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Volume sell information
      </span>
      {/* Remaining Committed Volume Display */}
      <div className="bg-gray-100 p-2 rounded-md text-gray-700 text-sm font-medium">
        Remaining Actual Produce Volume:
        <span className="font-bold text-green-400 px-1">
          {remainingProduceVolume}{" "}
        </span>
        liters
      </div>
      {/* Volume Amount */}
      {/* <InputField
        label="Volume Amount"
        name="soldAmount"
        defaultValue={data?.soldAmount}
        register={register}
        error={errors?.soldAmount}
        type="number"
      /> */}

      {/* Actual Produce Volume Input */}
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Selling Amount"
          name="soldAmount"
          defaultValue={data?.soldAmount}
          register={register}
          error={errors?.soldAmount}
          type="number"
        />
        {Number(soldAmount) > remainingProduceVolume && (
          <span className="text-red-500 text-xs">
            Cannot exceed {remainingProduceVolume} liters.
          </span>
        )}
      </div>
      {/* MC */}
      <InputField
        label="MC"
        name="mc"
        defaultValue={data?.mc}
        register={register}
        error={errors?.mc}
        type="number"
      />

      {/* MRO */}
      <InputField
        label="MRO"
        name="mro"
        defaultValue={data?.mro}
        register={register}
        error={errors?.mro}
        type="number"
      />

      {/* Hidden Fields for producerId and produceId */}
      <input
        type="hidden"
        {...register("producerId")}
        value={producers?.id || ""}
      />
      <input
        type="hidden"
        {...register("produceId")}
        value={produces?.id || ""}
      />
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

      {/* Select Consumer */}
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500">
          Select Oil Companies to Sell
        </label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("consumerId")}
          defaultValue={data?.consumerId}
        >
          {consumers.map((consumer: { id: string; name: string }) => (
            <option value={consumer.id} key={consumer.id}>
              {consumer.name}
            </option>
          ))}
        </select>
        {errors.consumerId?.message && (
          <p className="text-xs text-red-400">
            {errors.consumerId.message.toString()}
          </p>
        )}
      </div>

      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "createSold" ? "Submit" : "Update"}
      </button>
    </form>
  );
};

export default SoldForm;
