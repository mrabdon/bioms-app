"use client";

import {
  deleteAnnouncement,
  deleteConsumer,
  deleteEvent,
  deleteProducer,
  deleteUser,
  deleteVolume,
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
  producer: deleteProducer,
  consumer: deleteConsumer,
  user: deleteUser,
  announcement: deleteAnnouncement,
  event: deleteEvent,
  volumeActualProduce: deleteEvent,
};
const UserForm = dynamic(() => import("./forms/UserForm"), {
  loading: () => <h1>Loading...</h1>,
});

const VolumeForm = dynamic(() => import("./forms/VolumeForm"), {
  loading: () => <h1>Loading...</h1>,
});

const ProducerForm = dynamic(() => import("./forms/ProducerForm"), {
  loading: () => <h1>Loading...</h1>,
});

const ConsumerForm = dynamic(() => import("./forms/ConsumerForm"), {
  loading: () => <h1>Loading...</h1>,
});

const AnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"), {
  loading: () => <h1>Loading...</h1>,
});
const EventForm = dynamic(() => import("./forms/EventForm"), {
  loading: () => <h1>Loading...</h1>,
});
const VolumeActualProduceForm = dynamic(
  () => import("./forms/VolumeActualProduceForm"),
  {
    loading: () => <h1>Loading...</h1>,
  }
);

// const VolumeActualProduceForm = dynamic(
//   () => import("./forms/VolumeActualProduceForm"),
//   {
//     loading: () => <h1>Loading...</h1>,
//   }
// );

// const StudentForm = dynamic(() => import("./forms/StudentForm"), {
//   loading: () => <h1>Loading...</h1>,
// });

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update" | "createActual",
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  user: (setOpen, type, data, relatedData) => (
    <UserForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  volume: (setOpen, type, data, relatedData) => (
    <VolumeForm
      type={type}
      data={data}
      setOpen={setOpen}
      // relatedData={relatedData}
    />
  ),
  volumeActualProduce: (setOpen, type, data, relatedData) => (
    <VolumeActualProduceForm
      type={type}
      data={data}
      setOpen={setOpen}
      // relatedData={relatedData}
    />
  ),
  producer: (setOpen, type, data, relatedData) => (
    <ProducerForm
      type={type}
      data={data}
      setOpen={setOpen}
      // relatedData={relatedData}
    />
  ),

  consumer: (setOpen, type, data, relatedData) => (
    <ConsumerForm
      type={type}
      data={data}
      setOpen={setOpen}
      // relatedData={relatedData}
    />
  ),
  announcement: (setOpen, type, data, relatedData) => (
    <AnnouncementForm
      type={type}
      data={data}
      setOpen={setOpen}
      // relatedData={relatedData}
    />
  ),
  event: (setOpen, type, data, relatedData) => (
    <EventForm
      type={type}
      data={data}
      setOpen={setOpen}
      // relatedData={relatedData}
    />
  ),
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
      : type === "createActual"
      ? "bg-green-500"
      : type === "delete"
      ? "bg-red-400"
      : "bg-lamaPurple";

  const typeTitle =
    type === "delete"
      ? "Delete"
      : type === "create"
      ? "Create"
      : type === "update"
      ? "Update"
      : type === "createActual"
      ? "+ Actual Produce"
      : "Del";

  const [open, setOpen] = useState(false);

  const Form = () => {
    const [state, formAction] = useFormState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(`${table} has been deleted!`);
        setOpen(false);
        router.refresh();
      }
    }, [state, router]);

    return type === "delete" && id ? (
      <form
        action={formAction}
        className="p-4 flex flex-col gap-4 items-center"
      >
        <input type="text | number" name="id" value={id} hidden />
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
    ) : type === "create" || type === "update" || type === "createActual" ? (
      forms[table](setOpen, type, data, relatedData)
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
        {/* <Image src={`/${type}.png`} alt="" width={20} height={20} /> */}
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
