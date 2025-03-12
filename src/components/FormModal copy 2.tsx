"use client";

import {
  deleteAnnouncement,
  deleteConsumer,
  deleteEvent,
  deleteLift,
  deleteProduce,
  deleteCompany,
  deleteSold,
  deleteUser,
  deleteVolume,
  deleteInvite,
  deleteAdmin,
  deleteProducer,
  deleteStaff,
  archiveVolume,
} from "@/lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { FormContainerProps } from "./FormContainer";

const deleteActionMap = {
  volume: deleteVolume,
  company: deleteCompany,
  consumer: deleteConsumer,
  user: deleteUser,
  admin: deleteAdmin,
  producer: deleteProducer,
  staff: deleteStaff,
  announcement: deleteAnnouncement,
  event: deleteEvent,
  produce: deleteProduce,
  sold: deleteSold,
  lift: deleteLift,
  invite: deleteInvite,
};

const archiveActionMap = {
  volume: archiveVolume,
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const size = type === "create";
  const bgColor =
    type === "create"
      ? "bg-purple-500"
      : type === "update"
      ? "bg-green-500"
      : type === "invite"
      ? "bg-purple-500"
      : type === "createProduce"
      ? "bg-blue-500"
      : type === "createSold"
      ? "bg-pink-500"
      : type === "createLift"
      ? "bg-purple-500"
      : type === "delete"
      ? "bg-red-400"
      : type === "archive"
      ? "bg-orange-500"
      : "bg-biomsPurple";

  const typeTitle =
    type === "delete"
      ? "Delete"
      : type === "create"
      ? "Create"
      : type === "update"
      ? "Update"
      : type === "createProduce"
      ? "+ Actual Produce"
      : type === "createSold"
      ? "Sell"
      : type === "createLift"
      ? "Lift"
      : type === "invite"
      ? "Invite"
      : type === "archive"
      ? "Archive"
      : "Action";

  const [open, setOpen] = useState(false);

  const Form = () => {
    const action =
      type === "delete" ? deleteActionMap[table] : archiveActionMap[table];

    const [state, formAction] = useFormState(action, {
      success: false,
      error: false,
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(
          `${table} has been ${type === "delete" ? "deleted" : "archived"}!`
        );
        setOpen(false);
        router.refresh();
      }
    }, [state, router]);

    return type === "delete" && id ? (
      <form
        action={formAction}
        className="p-4 flex flex-col gap-4 items-center"
      >
        <input type="hidden" name="id" value={id} />
        <Image
          className="mb-4"
          src="/x-icon.png"
          alt="Cancel Icon"
          width={100}
          height={100}
        />
        <span className="text-center font-medium">
          Are you sure you want to delete this {table}?
        </span>
        <span className="text-center font-light">All data will be lost</span>

        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Delete
        </button>
      </form>
    ) : type === "archive" && id ? (
      <form
        action={formAction}
        className="p-4 flex flex-col gap-4 items-center"
      >
        <input type="hidden" name="id" value={id} />
        {/* <Image
          className="mb-4"
          src="/x-icon.png"
          alt="Cancel Icon"
          width={100}
          height={100}
        /> */}
        <span className="text-center font-medium">
          Are you sure you want to archive this {table}?
        </span>
        <span className="text-center font-light">All data will be lost</span>

        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Archive
        </button>
      </form>
    ) : (
      "Form not found!"
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center text-white font-bold g-2 p-2 justify-center rounded-full ${bgColor}`}
        title={`${typeTitle}`}
        onClick={() => setOpen(true)}
      >
        {typeTitle}
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
