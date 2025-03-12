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

// type SoldList = Sold & {} & { company: Company } & {
//   consumer: Consumer;
// } & { produce: Produce } & {
//   produce: {
//     volume: {
//       companies: Company[];
//     };
//   };
// } & { lifts: Lift[] };

type SoldList = Sold & {
  company: Company;
  consumer: Consumer;
  produce: Produce & {
    volume: Volume & {
      companies: Company[];
    };
  };
  lifts: Lift[];
};

const SoldListPage = async ({
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
      header: "Sold",
      accessor: "actualProduce",
      className: "",
    },

    {
      header: "Sold to",
      accessor: "sold",
      className: "hidden lg:table-cell",
    },
    {
      header: "Molasses Certificate",
      accessor: "mc",
      className: "hidden lg:table-cell",
    },
    {
      header: "Molasses Release Order",
      accessor: "mro",
      className: "hidden lg:table-cell",
    },
    {
      header: "Date Sold",
      accessor: "createdAt",
      className: "hidden lg:table-cell",
    },
    {
      header: "Unlifted",
      accessor: "remainingLiftVolume",
      className: "hidden lg:table-cell",
    },
    {
      header: "Status",
      accessor: "status",
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

  const renderRow = (item: SoldList & { remainingSoldVolume: number }) => {
    const liftedPercentage =
      item.soldAmount && item.soldAmount > 0
        ? (
            ((item.soldAmount - item.remainingSoldVolume) / item.soldAmount) *
            100
          ).toFixed(2)
        : "N/A";

    // Define color based on reversed percentage range
    const percentageNumber = parseFloat(liftedPercentage);
    let statusColor = "text-gray-500 bg-gray-200"; // Default for N/A

    if (!isNaN(percentageNumber)) {
      if (percentageNumber >= 75) {
        statusColor = "text-green-600 bg-green-100 font-bold"; // ✅ High Lifted (Good)
      } else if (percentageNumber >= 50) {
        statusColor = "text-green-500 bg-green-100"; // 🟢 Moderate Lifted
      } else if (percentageNumber >= 25) {
        statusColor = "text-yellow-600 bg-yellow-100"; // ⚠️ Low Lifted
      } else {
        statusColor = "text-red-600 bg-red-100 font-bold"; // 🔴 Very Low Lifted (Bad)
      }
    }

    return (
      <tr
        key={item.id}
        className="border-b text-sm border-gray-200 even:bg-slate-50 font-medium hover:bg-gray-100"
      >
        {/* {role === "admin" && <td>{item.volume.c}</td>} */}

        {role === "admin" && (
          <td>
            <div className="flex items-center gap-2 p-4">
              {item.produce.volume.companies.map((company) => (
                <span key={company.id}>{company.name}</span>
              ))}
            </div>
          </td>
        )}
        <td className="hidden md:table-cell p-4 ">
          {/* {item.produce.month}{" "}
          {item.produce.volume?.year ?? "No Year Available"} */}
          {item.produce?.month} {item.produce?.volume.year}
        </td>

        <td className="hidden md:table-cell ">{item.soldAmount}</td>
        <td className="hidden md:table-cell ">{item.consumer.name}</td>
        <td className="hidden md:table-cell ">{item.mc}</td>
        <td className="hidden md:table-cell ">{item.mro}</td>
        <td className="hidden md:table-cell ">
          {item.createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </td>
        <td className="hidden md:table-cell ">
          {item.remainingSoldVolume?.toLocaleString()}
        </td>
        <td className="lg:table-cell flex items-center justify-center">
          <span className={`px-2 py-1 rounded-full font-medium ${statusColor}`}>
            {liftedPercentage}% lifted
          </span>
        </td>

        <td>
          <div className="flex items-center gap-2">
            {(role === "producer" || role === "staff") && (
              <>
                <FormContainer table="lift" type="createLift" data={item} />
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.SoldWhereInput = {};
  query.produce = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { produce: { month: { contains: value, mode: "insensitive" } } },
              {
                produce: {
                  volume: {
                    companies: {
                      some: { name: { contains: value, mode: "insensitive" } },
                    },
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
      query.produce = {
        volume: {
          companies: {
            some: {
              id: currentUserCompanyId, // Ensure it's a valid string
            },
          },
        },
      };
      break;

    case "staff":
      query.produce = {
        volume: {
          companies: {
            some: {
              id: currentUserCompanyId, // Ensure it's a valid string
            },
          },
        },
      };
      break;

    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.sold.findMany({
      where: query,
      include: {
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

        consumer: {
          select: {
            name: true,
          },
        },
        lifts: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: {
        createdAt: "desc", // Orders by createdAt field in descending order
      },
    }),
    prisma.sold.count({ where: query }),
  ]);

  // CALCULATIONS
  const soldWithRemaining = data.map((sold) => {
    const totalLift = sold.lifts.reduce(
      (sum, lift) => sum + (lift.liftVolume ?? 0),
      0
    );

    return {
      ...sold,
      remainingSoldVolume: (sold.soldAmount ?? 0) - totalLift,
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
      </div>
      <TabVolumeContainer />
      <Table columns={columns} renderRow={renderRow} data={soldWithRemaining} />

      {/* No need to pass handlers, UploadCSV now handles its own logic */}

      {/* <Upload /> */}

      <Pagination page={p} count={count} />
    </div>
  );
};

export default SoldListPage;
