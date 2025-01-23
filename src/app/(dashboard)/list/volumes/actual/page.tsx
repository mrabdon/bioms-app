// pages/ActualListPage.tsx
import Pagination from "@/components/Pagination";
import Tab from "@/components/Tab";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import TabVolumeContainer from "@/components/TabVolumeContainer";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import {
  Prisma,
  Volume,
  VolumeSoldToProducer,
  ActualProduce,
  Consumer,
  Producer,
} from "@prisma/client";

type VolumeList = ActualProduce & {
  // volumeSoldToProducer: {
  //   consumer: Consumer; // Assuming 'consumers' is an array
  //   producer: Producer; // Assuming 'producers' is an array
  // };
} & { volume: Volume } & { producer: Producer } & { consumer: Consumer } & {
  volumeSoldToProducers: VolumeSoldToProducer[];
} & {
  actualProduces: ActualProduce[];
};

const ActualListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // const producerId = (sessionClaims?.metadata as { producerId?: string })
  //   ?.producerId; // Assuming companyId is in the sessionClaims

  const columns = [
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
    // {
    //   header: "Updated At",
    //   accessor: "updatedAt",
    //   className: "hidden lg:table-cell",
    // },

    // ...(role === "producer"
    //   ? [
    //       {
    //         header: "",
    //         accessor: "action",
    //       },
    //     ]
    //   : []),
  ];

  const renderRow = (item: VolumeList) => (
    <tr
      key={item.id}
      className="border-b text-sm border-gray-200 even:bg-slate-50 font-medium hover:bg-gray-100"
    >
      <td className="hidden md:table-cell p-4 ">
        {item.month && item.volume?.year ? (
          <div>
            {item.month} {item.volume.year}
          </div>
        ) : (
          <div>
            {new Date(item.volume.createdAt)
              .toLocaleDateString("en-US", { year: "numeric", month: "short" })
              .split(" ")
              .reverse()
              .join(" ")}
          </div>
        )}
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

      <td>
        <div className="flex items-center gap-2">
          {/* {role === "admin" && (
            <>
              <FormContainer
                table="volumeActualProduce"
                type="createActual"
                data={item}
              />
            </>
          )} */}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  let query: Prisma.ActualProduceWhereInput = {};

  // // If producerId exists in sessionClaims, filter by producerId
  // if (producerId) {
  //   query.volume.producerId = producerId;
  // }

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
    prisma.actualProduce.findMany({
      where: query,
      include: {
        volume: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: {
        date: "desc", // Orders by createdAt field in descending order
      },
    }),
    prisma.actualProduce.count({ where: query }),
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
      </div>

      <TabVolumeContainer />

      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* No need to pass handlers, UploadCSV now handles its own logic */}

      {/* <Upload /> */}

      <Pagination page={p} count={count} />
    </div>
  );
};

export default ActualListPage;
