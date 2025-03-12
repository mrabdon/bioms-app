"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { FormData } from "@/types/mailForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { mailFormSchema } from "@/lib/formValidationSchemas";
import toast from "react-hot-toast";

function MailForm({
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
  } = useForm<FormData>({ resolver: zodResolver(mailFormSchema) });

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
            placeholder="Name"
            id="name"
            type="text"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
            {...register("name")}
          />
          {errors.name && (
            <span className="text-red-500">{errors.name.message}</span>
          )}
        </div>
        <div>
          <input
            placeholder="Email"
            id="email"
            type="text"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </div>
        <div>
          <input
            placeholder="Subject"
            id="subject"
            type="text"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
            {...register("subject")}
          />
          {errors.subject && (
            <span className="text-red-500">{errors.subject.message}</span>
          )}
        </div>
        <div>
          <textarea
            placeholder="Message"
            id="message"
            rows={4}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
            {...register("message")}
          />
          {errors.message && (
            <span className="text-red-500">{errors.message.message}</span>
          )}
        </div>
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

export default MailForm;
