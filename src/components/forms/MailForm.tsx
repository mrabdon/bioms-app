"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
  liftSchema,
  LiftSchema,
  mailFormSchema,
  MailFormSchema,
} from "@/lib/formValidationSchemas";
import { createLift, updateLift } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { MailFormData } from "@/types/mail-form";

const MailForm = ({
  type,
  data,
  setOpen,
  relatedData,
  sendMail,
}: {
  type: "create" | "update" |  "invite" |"createProduce" | "createSold" | "createLift";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
  sendMail: (
    formData: MailFormData
  ) => Promise<{ success: boolean; error: string | null }>;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MailFormSchema>({
    resolver: zodResolver(mailFormSchema),
  });

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE

  const [state, formAction] = useFormState(
    type === "createLift" ? createLift : updateLift,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = async (formData: MailFormData) => {
    console.log(formData);

    const result = await sendMail(formData);
    if (result.success) {
      toast.success("Message sent successfully", { position: "bottom-center" });
      reset();
    } else {
      toast.error(result.error, {
        position: "bottom-center",
      });
    }
    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(
          `Lift has been ${type === "createLift" ? "created" : "updated"}!`
        );
        setOpen(false);
        router.refresh();
      }
    }, [state, router, type, setOpen]);

    const { sold } = relatedData;

    return (
      <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-xl font-semibold">
          {type === "createLift" ? "Create a new lift" : "Update the lift"}
        </h1>

        <div className="flex justify-between flex-wrap gap-4">
          <InputField
            label="First Name"
            name="firstName"
            defaultValue={data?.firstName}
            register={register}
            error={errors?.firstName}
          />
          <InputField
            label="Last Name"
            name="lastName"
            defaultValue={data?.lastName}
            register={register}
            error={errors?.lastName}
          />
          <InputField
            label="Email"
            name="email"
            defaultValue={data?.email}
            register={register}
            error={errors?.email}
          />
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
};
export default MailForm;
