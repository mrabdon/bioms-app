"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  producerSchema,
  ProducerSchema,
  staffSchema,
  StaffSchema,
  UserSchema,
  userSchema,
} from "@/lib/formValidationSchemas";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  createAdmin,
  createProducer,
  createStaff,
  createUser,
  updateAdmin,
  updateProducer,
  updateStaff,
  updateUser,
} from "@/lib/actions";
import { useFormState } from "react-dom";
import { CldUploadWidget } from "next-cloudinary";
import * as React from "react";
import { useSignUp, useUser } from "@clerk/nextjs";
import { Company } from "@prisma/client";

// interface UploadResult {
//   info: {
//     original_filename: string;
//     secure_url: string; // Add other properties if needed
//   };
// }

const StaffForm = ({
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
  } = useForm<StaffSchema>({
    resolver: zodResolver(staffSchema),
  });

  const [img, setImg] = useState<any>();
  // const [imgName, setImgName] = useState<any>();

  const [state, formAction] = useFormState(
    type === "create" ? createStaff : updateStaff,
    {
      success: false,
      error: false,
    }
  );
  const onSubmit = handleSubmit((data) => {
    console.log(data);
    formAction({ ...data, img: img?.secure_url });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Staff has been ${type === "create" ? "created" : "updated"}`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { companies } = relatedData;
  const { user } = useUser(); // Get the current logged-in user
  // Filter companies by current user's companyId
  const filteredCompanies = companies.filter(
    (company: { id: string }) => company.id === user?.publicMetadata.companyId
  );

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Add Staff Account" : "Update Staff Account"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information of the Staff
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
          disabled={type === "update"}
        />
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />

        <InputField
          label="First Name"
          name="firstName"
          defaultValue={data?.firstName}
          register={register}
          error={errors.firstName}
        />

        <InputField
          label="Last Name"
          name="lastName"
          defaultValue={data?.lastName}
          register={register}
          error={errors.lastName}
        />
      </div>
      {/* <div className="flex flex-col gap-2 w-full ">
        <label className="text-xs text-gray-500">Company Name</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("companyId")}
          defaultValue={data?.companyId}
        >
          {companies.map((company: { id: string; name: string }) => (
            <option value={company.id} key={company.id}>
              {company.name}
            </option>
          ))}
        </select>
        {errors.companyId?.message && (
          <p className="text-xs text-red-400">
            {errors.companyId.message.toString()}
          </p>
        )}

        
      </div> */}

      <div className="flex flex-col gap-2 w-full">
        <label className="text-xs text-gray-500">Company Name</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("companyId")}
          defaultValue={data?.companyId}
        >
          {filteredCompanies.map((company: Company) => (
            <option value={company.id} key={company.id}>
              {company.name}
            </option>
          ))}
        </select>
        {errors.companyId?.message && (
          <p className="text-xs text-red-400">
            {errors.companyId.message.toString()}
          </p>
        )}
      </div>
      <CldUploadWidget
        uploadPreset="school"
        onSuccess={(result, { widget }) => {
          setImg(result.info);
          widget.close();
        }}
      >
        {({ open }) => {
          return (
            <div
              className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
              onClick={() => open()}
            >
              <Image src="/upload.png" alt="" width={28} height={28} />
              <span>Upload a photo</span>
            </div>
          );
        }}
      </CldUploadWidget>

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
        <span className="text-red-500">Username/Email already exists!!</span>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Add" : "Update"}
      </button>
    </form>
  );
};

export default StaffForm;
