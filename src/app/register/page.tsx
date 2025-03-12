"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { FormData } from "@/types/mailForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { mailFormSchema, registerSchema } from "@/lib/formValidationSchemas";
import toast from "react-hot-toast";
import InputField from "@/components/InputField";
import { auth } from "@clerk/nextjs/server";

function RegisterForm({
  sendMail,
}: {
  sendMail: (
    formData: FormData
  ) => Promise<{ success: boolean; error: string | null }>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(registerSchema) });

  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  // const data = await prisma

  const onSubmit = async (formData: FormData) => {
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
  };
  return (
    <div className="max-w-md mx-auto mt-20 p-6 rounded-md bg-white shadow-md">
      <h1 className="text-2xl font-bold mb-4">Email</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            placeholder="Username"
            id="username"
            type="text"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
            {...register("username")}
          />
          {errors.username && (
            <span className="text-red-500">{errors.username.message}</span>
          )}
        </div>
        <div>
          <input
            placeholder="password"
            id="password"
            type="text"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </div>
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
        <button
          type="submit"
          className="w-full px-4 bg-blue-500 py-2 text-white font-medium rounded-md"
        >
          {isSubmitting ? "Processing" : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
