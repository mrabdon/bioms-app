// pages/ActualListPage.tsx
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
  Sold,
  Produce,
  Company,
  Lift,
} from "@prisma/client";

// type LiftList = Lift & {
//   sold: { produce: { month: true; volume: Volume } };
// } & {
//   produce: Produce;
// };

type LiftList = Lift & {
  sold: Sold & {
    produce: Produce & {
      volume: Volume & {
        companies: Company[];
      };
    };
  };
};
const LiftListPage = async ({
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
      header: "Lifted Volume",
      accessor: "liftVolume",
      className: "",
    },
    {
      header: "Date Lifted",
      accessor: "date",
      className: "",
    },

    {
      header: "Region",
      accessor: "region",
      className: "hidden lg:table-cell",
    },
    {
      header: "Remarks",
      accessor: "remark",
      className: "hidden lg:table-cell",
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

  const renderRow = (item: LiftList) => (
    <tr
      key={item.id}
      className="border-b text-sm border-gray-200 even:bg-slate-50 font-medium hover:bg-gray-100"
    >
      {role === "admin" && (
        <td>
          <div className="flex items-center gap-2 p-4">
            {item.sold?.produce.volume.companies.map((company) => (
              <span key={company.id}>{company.name}</span>
            ))}
          </div>
        </td>
      )}
      <td className="hidden md:table-cell p-4 ">
        {item.sold?.produce.month} {item.sold?.produce.volume.year}
      </td>

      <td className="hidden md:table-cell ">{item.liftVolume}</td>
      <td className="hidden md:table-cell ">
        {item.date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short", // Abbreviated month (e.g., Jan, Feb, Mar)
          day: "numeric", // Day of the month (e.g., 10)
        })}
      </td>
      <td className="hidden md:table-cell ">{item.region}</td>
      <td className="hidden md:table-cell ">{item.remark}</td>
      <td className="hidden md:table-cell "></td>

      {/* <td>
        <div className="flex items-center gap-2">
          {(role === "producer" || role === "staff") && (
            <>
              <FormContainer table="lift" type="createLift" data={item} />
            </>
          )}
        </div>
      </td> */}
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.LiftWhereInput = {};

  query.sold = {};
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
  // ROLE CONDITIONS
  switch (role) {
    case "admin":
      break;
    case "producer":
      query.sold = {
        produce: {
          volume: {
            companies: {
              some: {
                id: currentUserCompanyId, // Ensure it's a valid string
              },
            },
          },
        },
      };
      break;
    case "staff":
      query.sold = {
        produce: {
          volume: {
            companies: {
              some: {
                id: currentUserCompanyId, // Ensure it's a valid string
              },
            },
          },
        },
      };
      break;

    default:
      break;
  }
  const [data, count] = await prisma.$transaction([
    prisma.lift.findMany({
      where: query,
      include: {
        sold: {
          select: {
            produce: {
              select: {
                month: true,
                actualProduction: true,
                volume: {
                  // Ensure volume is included
                  select: {
                    year: true, // Get the year field
                    companies: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: {
        date: "desc", // Orders by createdAt field in descending order
      },
    }),
    prisma.lift.count({ where: query }),
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
      </div>
      <TabVolumeContainer />

      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* No need to pass handlers, UploadCSV now handles its own logic */}

      {/* <Upload /> */}

      <Pagination page={p} count={count} />
    </div>
  );
};

export default LiftListPage;
