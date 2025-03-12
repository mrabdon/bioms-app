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
  type: "create" | "update" | "createProduce" | "createSold" | "createLift";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
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
  //   console.log(data);
  //   formAction(data);
  // });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Volume has been ${type === "createSold" ? "sold" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { consumers, producers, produces, volumes } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "createSold" ? "Sold to" : "Update Sold to"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Volume sell information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        {/* Proposed Volume */}

        <InputField
          label="Volume Amount"
          name="soldAmount"
          defaultValue={data?.soldAmount}
          register={register}
          error={errors?.soldAmount}
          type="number"
        />
      </div>
      <div className="flex justify-between flex-wrap gap-4">
        {/* Proposed Volume */}
        <InputField
          label="MC"
          name="mc"
          defaultValue={data?.mc}
          register={register}
          error={errors?.mc}
          type="number"
        />
      </div>
      <div className="flex justify-between flex-wrap gap-4">
        {/* Proposed Volume */}
        <InputField
          label="MRO"
          name="mro"
          defaultValue={data?.mro}
          register={register}
          error={errors?.mro}
          type="number"
        />
      </div>
      {/* Hidden Fields for producerId and produceId */}
      <input type="hidden" {...register("producerId")} value={producers?.id} />
      <input
        type="hidden"
        {...register("produceId")}
        value={produces?.id || ""}
      />
      <input
        type="hidden"
        {...register("volumeId")}
        value={volumes?.id || ""}
      />

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
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500">
          Select Oil Companies to Sell
        </label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("consumerId")}
          defaultValue={data?.consumers}
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
