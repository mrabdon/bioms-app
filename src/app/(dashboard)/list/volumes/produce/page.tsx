import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Tab from "@/components/Tab";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import TabVolumeContainer from "@/components/TabVolumeContainer";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import {
  Prisma,
  Volume,
  Consumer,
  Producer,
  Produce,
  Sold,
  Company,
} from "@prisma/client";

// type ProduceList = Produce & {} & { companies: Company[] } & {
//   volume: Volume & { select: { companies: Company[] } };
// } & {
//   producer: Producer;
// } & {
//   consumer: Consumer;
// } & {
//   solds: Sold[];
// } & {};

type ProduceList = Produce & {
  companies: Company[]; // Directly include companies
  volume: Volume & { companies: Company[] }; // Volume includes companies
  producer: Producer;
  consumer: Consumer;
  solds: Sold[];
};

const ProduceListPage = async ({
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
      header: "Month",
      accessor: "month",
      className: "p-4",
    },
    {
      header: "Actual Production",
      accessor: "actualProduce",
      className: "p-4",
    },

    {
      header: "Date Created",
      accessor: "createdAt",
      className: "hidden lg:table-cell",
    },
    {
      header: "Unsold",
      accessor: "remainingProduceVolume",
      className: "p-4",
    },
    ...(role === "producer" || role === "staff"
      ? [
          {
            header: "",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: ProduceList & { produceWithRemaining: number }) => (
    <tr
      key={item.id}
      className="border-b text-sm border-gray-200 even:bg-slate-50 font-medium hover:bg-gray-100"
    >
      {/* {role === "admin" && <td>{item.volume.c}</td>} */}

      {role === "admin" && (
        <td>
          <div className="flex items-center gap-2 p-4">
            {item.volume.companies.map((company) => (
              <span key={company.id}>{company.name}</span>
            ))}
          </div>
        </td>
      )}
      <td className="hidden md:table-cell p-4 ">
        {item.month} {item.volume.year}
      </td>

      <td className="flex items-center gap-2 p-4">
        {item.actualProduction?.toLocaleString()}
      </td>

      <td className="hidden md:table-cell ">
        {item.date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short", // Abbreviated month (e.g., Jan, Feb, Mar)
          day: "numeric", // Day of the month (e.g., 10)
        })}
      </td>
      <td className="flex items-center gap-2 p-4">
        {item.remainingProduceVolume?.toLocaleString()}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "producer" || role === "staff") && (
            <>
              <FormContainer table="sold" type="createSold" data={item} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.ProduceWhereInput = {};
  query.volume = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { month: { contains: value, mode: "insensitive" } },
              {
                volume: {
                  companies: {
                    some: { name: { contains: value, mode: "insensitive" } },
                  },
                },
              },
            ];
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
      query.volume = {
        companies: {
          some: {
            id: currentUserCompanyId,
          },
        },
      };
      break;
    case "staff":
      query.volume = {
        companies: {
          some: {
            id: currentUserCompanyId,
          },
        },
      };
      break;

    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.produce.findMany({
      where: query,
      include: {
        volume: {
          select: {
            producerId: true,
            committedVolume: true,
            year: true,
            companies: {
              select: {
                name: true,
              },
            },
          },
        },
        solds: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: {
        date: "desc", // Orders by createdAt field in descending order
      },
    }),
    prisma.produce.count({ where: query }),
  ]);

  // CALCULATIONS
  const produceWithRemaining = data.map((produce) => {
    const totalSold = produce.solds.reduce(
      (sum, sold) => sum + (sold.soldAmount ?? 0),
      0
    );

    return {
      ...produce,
      remainingProduceVolume: (produce.actualProduction ?? 0) - totalSold,
    };
  });

  return (
    <div className="p-6 bg-white border min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-800">Actual Produce</h1>
          <p className="text-sm text-gray-500">
            View and manage actual produce
          </p>
        </div>
      </div>

      <div className="sm:flex sm:items-center justify-between mb-4 gap-4">
        <TableSearch />
      </div>
      <TabVolumeContainer />

      <Table
        columns={columns}
        renderRow={renderRow}
        data={produceWithRemaining}
      />

      {/* No need to pass handlers, UploadCSV now handles its own logic */}

      {/* <Upload /> */}

      <Pagination page={p} count={count} />
    </div>
  );
};

export default ProduceListPage;
