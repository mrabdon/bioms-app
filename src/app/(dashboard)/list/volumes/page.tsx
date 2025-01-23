// pages/volumeListPage.tsx
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { getRelativeTime } from "@/lib/utils";
import {
  Prisma,
  Producer,
  Volume,
  Consumer,
  VolumeSoldToProducer,
} from "@prisma/client";
import Tab from "@/components/Tab";
import TabVolumeContainer from "@/components/TabVolumeContainer";

type VolumeList = Volume & {
  // volumeSoldToProducer: {
  //   consumer: Consumer; // Assuming 'consumers' is an array
  //   producer: Producer; // Assuming 'producers' is an array
  // };
} & { producer: Producer } & { consumer: Consumer } & {
  volumeSoldToProducers: VolumeSoldToProducer[];
};

const renderRow = (item: VolumeList) => (
  <tr
    key={item.id}
    className="border-b text-sm border-gray-200 even:bg-slate-50 font-medium hover:bg-gray-100"
  >
    <td className="hidden md:table-cell p-4 ">
      {!item.quarter || !item.year ? (
        <span>
          {" "}
          {new Date(item.createdAt)
            .toLocaleDateString("en-US", { year: "numeric", month: "short" })
            .split(" ")
            .reverse()
            .join(" ")}
        </span>
      ) : (
        <span>
          {item.quarter} {item.year}
        </span>
      )}
    </td>
    <td className="flex items-center gap-2 p-4">
      {item.committedVolume != null
        ? item.committedVolume.toLocaleString() // Add commas if it's a number
        : "-"}
    </td>
    <td className="hidden md:table-cell ">
      {item.createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short", // Abbreviated month (e.g., Jan, Feb, Mar)
        day: "numeric", // Day of the month (e.g., 10)
      })}
    </td>
    <td className="hidden md:table-cell ">
      {/* Replace the exact date/time with the relative time */}
      {getRelativeTime(new Date(item.updatedAt))}
    </td>

    <td>
      <div className="flex items-center gap-2">
        {role === "admin" && (
          <>
            <FormContainer table="volume" type="update" data={item} />
            <FormContainer table="volume" type="delete" id={item.id} />

            <FormContainer
              table="volumeActualProduce"
              type="createActual"
              data={item}
            />
          </>
        )}
      </div>
    </td>
  </tr>
);

const VolumeListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const producerId = (sessionClaims?.metadata as { producerId?: string })
    ?.producerId; // Assuming companyId is in the sessionClaims

  const columns = [
    {
      header: "Quarter / Year",
      accessor: "quarterYear",
      className: "p-4",
    },
    {
      header: "Committed Volume",
      accessor: "committedVolume",
      className: "p-4",
    },

    {
      header: "Date Created",
      accessor: "createdAt",
      className: "hidden lg:table-cell",
    },
    {
      header: "Updated At",
      accessor: "updatedAt",
      className: "hidden lg:table-cell",
    },

    ...(role === "producer"
      ? [
          {
            header: "",
            accessor: "action",
          },
        ]
      : []),
  ];
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  let query: Prisma.VolumeWhereInput = {};

  // If producerId exists in sessionClaims, filter by producerId
  if (producerId) {
    query.producerId = producerId;
  }

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [];
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.volume.findMany({
      where: query,
      include: {
        volumeSoldToProducers: true,
        actualProduces: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: {
        createdAt: "desc", // Orders by createdAt field in descending order
      },
    }),

    prisma.volume.count({ where: query }),
  ]);

  return (
    <div className="p-6 bg-white border min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-800">Volumes</h1>
          <p className="text-sm text-gray-500">View and manage volumes</p>
        </div>
      </div>

      <div className="sm:flex sm:items-center justify-between mb-4 gap-4">
        <TableSearch />
        <select className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none">
          <option>Sort by: Date</option>
          <option>Sort by: Committed Volume</option>
          <option>Sort by: Actual Production</option>
        </select>
        {role === "producer" && (
          <>
            {/* {existingVolume && (
              <div className="text-red-500 font-medium">
                A volume for this quarter and year already exists.
              </div>
            )} */}
            <FormContainer table="volume" type="create" />
          </>
        )}
      </div>

      <TabVolumeContainer />
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* No need to pass handlers, UploadCSV now handles its own logic */}

      {/* <Upload /> */}

      <Pagination page={p} count={count} />
    </div>
  );
};

export default VolumeListPage;
