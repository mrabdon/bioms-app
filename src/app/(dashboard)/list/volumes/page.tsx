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
import TabVolumeContainer from "@/components/TabVolumeContainer";
import {
  Prisma,
  Producer,
  Volume,
  Consumer,
  Sold,
  Company,
} from "@prisma/client";

type VolumeList = Volume & {} & { companies: Company[] } & {
  producer: Producer;
} & {
  consumer: Consumer;
} & {
  solds: Sold[];
};

const VolumeListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;
  let currentUserCompanyId: string | undefined = undefined;

  if (currentUserId) {
    const staffCompany = await prisma.producer.findUnique({
      where: { id: currentUserId },
      select: { companyId: true },
    });

    currentUserCompanyId = staffCompany?.companyId || undefined;
  }

  const columns = [
    ...(role === "admin"
      ? [
          {
            header: "Company Name",
            accessor: "companyName",
            className: "p-4",
          },
        ]
      : []),
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

    {
      header: "Remaining Volume",
      accessor: "remainingCommittedVolume",
      className: "p-4",
    },
    {
      header: "Status",
      accessor: "status",
      className: "p-4",
    },
    ...(role === "admin" || role === "producer" || role === "staff"
      ? [
          {
            header: "",
            accessor: "action",
          },
        ]
      : []),
  ];


  
  const renderRow = (
    item: VolumeList & { remainingCommittedVolume: number }
  ) => (
    <tr
      key={item.id}
      className="border-b text-sm border-gray-200 even:bg-slate-50 font-medium hover:bg-gray-100"
    >
      {role === "admin" && (
        <td>
          <div className="flex items-center gap-2 p-4">
            {item.companies.map((company) => (
              <span key={company.id}>{company.name}</span>
            ))}
          </div>
        </td>
      )}

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
      <td className="flex items-center gap-2 p-4">
        {item.remainingCommittedVolume}
      </td>
      {/* Status Column with INVITED Badge - responsive */}
      <td className="lg:table-cell flex items-center justify-center">
        {item.archived ? (
          <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-orange-600 bg-orange-100 rounded-full">
            <span className="w-2.5 h-2.5 mr-2 bg-orange-500 rounded-full"></span>
            Archived
          </div>
        ) : (
          <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 bg-green-100 rounded-full">
            <span className="w-2.5 h-2.5 mr-2 bg-green-500 rounded-full"></span>
            Active
          </div>
        )}
      </td>

      <td>
        <div className="flex items-center gap-2">
          {(role === "producer" || role === "staff") && !item.archived && (
            <>
              <FormContainer table="volume" type="update" data={item} />
              <FormContainer table="produce" type="createProduce" data={item} />
            </>
          )}

          {role === "admin" && (
            <>
              <FormContainer table="volume" type="archive" id={item.id} />
              <FormContainer table="volume" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.VolumeWhereInput = {};
  query.companies = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.quarter = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS
  switch (role) {
    case "admin":
      break;
    case "producer":
      query.companies = {
        some: {
          id: currentUserCompanyId,
        },
      };
      break;
    case "staff":
      query.companies = {
        some: {
          id: currentUserCompanyId,
        },
      };
      break;

    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.volume.findMany({
      where: query,
      include: {
        solds: true,
        produces: true,
        companies: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: {
        createdAt: "desc", // Orders by createdAt field in descending order
      },
    }),

    prisma.volume.count({ where: query }),
  ]);

  // CALCULATIONS
  const volumesWithRemaining = data.map((volume) => {
    const totalActualProduction = volume.produces.reduce(
      (sum, produce) => sum + (produce.actualProduction ?? 0),
      0
    );

    return {
      ...volume,
      remainingCommittedVolume:
        (volume.committedVolume ?? 0) - totalActualProduction,
    };
  });

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
        {(role === "producer" || role === "staff") && (
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

      <Table
        columns={columns}
        renderRow={renderRow}
        data={volumesWithRemaining}
      />

      {/* No need to pass handlers, UploadCSV now handles its own logic */}

      {/* <Upload /> */}

      <Pagination page={p} count={count} />
    </div>
  );
};

export default VolumeListPage;
