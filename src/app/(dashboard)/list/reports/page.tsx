// pages/volumeListPage.tsx
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Tab from "@/components/Tab";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import TabListContainer from "@/components/TabListContainer";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import {
  Prisma,
  Producer,
  Volume,
  Consumer,
  VolumeSoldToProducer,
  ActualProduce,
} from "@prisma/client";

type VolumeList = Volume & { actualProduce: ActualProduce[] } & {
  producer: Producer;
} & {
  consumer: Consumer;
} & {
  volumeSoldToProducers: VolumeSoldToProducer[];
};
const columns = [
  {
    header: "CLIENT'S NAME",
    accessor: "client",
    className: "p-4",
  },

  {
    header: "Date",
    accessor: "date",
    className: "",
  },
  {
    header: "Commited Volume",
    accessor: "commitedVolume",
    className: "",
  },
  {
    header: "Actual Production",
    accessor: "actualProduction",
    className: "hidden lg:table-cell",
  },
  {
    header: "Beg Inventory",
    accessor: "begInventory`",
    className: "hidden lg:table-cell",
  },
  {
    header: "Total Stock",
    accessor: "totalStock",
    className: "hidden lg:table-cell",
  },
  {
    header: "Sold",
    accessor: "sold",
    className: "hidden lg:table-cell",
  },
  {
    header: "Unsold",
    accessor: "unsold",
    className: "hidden lg:table-cell",
  },
  {
    header: "Sold to",
    accessor: "soldTo",
    className: "hidden lg:table-cell",
  },
];
const renderRow = (item: VolumeList) => (
  <tr
    key={item.id}
    className="border-b text-sm border-gray-200 even:bg-slate-50 font-medium hover:bg-gray-100"
  >
    <td className="hidden md:table-cell p-4">{item.producer?.name || "-"}</td>

    <td>
      {new Date(item.createdAt)
        .toLocaleDateString("en-US", { year: "numeric", month: "short" })
        .split(" ")
        .reverse()
        .join(" ")}
    </td>
    <td className="flex items-center gap-2 p-4 ">
      {item.committedVolume?.toLocaleString() || 0}
    </td>
    <td className="hidden md:table-cell ">
      {item.actualProduce.map((actual) => actual.actualProduction || 0)}
    </td>
    <td className="hidden md:table-cell ">
      {item.begInventory?.toLocaleString()}
    </td>
    <td className="hidden md:table-cell ">
      {item.totalStock?.toLocaleString()}
    </td>
    <td className="hidden md:table-cell ">
      {item.volumeSoldToProducers
        .map((volumeSold) => volumeSold.soldAmount || 0)
        .toLocaleString()}
    </td>
    <td className="hidden md:table-cell ">{item.unsold?.toLocaleString()}</td>
    <td className="hidden md:table-cell "> {item.consumer?.name || "-"}</td>

    <td>
      <div className="flex items-center gap-2">
        {/* {role === "admin" && (
          <>
            <FormContainer table="volume" type="update" data={item} />
            <FormContainer table="volume" type="delete" id={item.id} />
          </>
        )} */}
      </div>
    </td>
  </tr>
);

const VolumeListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // let query: Prisma.VolumeWhereInput = {};

  const query: Prisma.VolumeWhereInput = {};

  // query.volume = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          // case "producerId":
          //   query.volumeSoldToProducer.producerId = value;
          //   break;
          // case "consumerId":
          //   query.volumeSoldToProducer.consumerId = value;
          //   break;
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
        producer: { select: { name: true } },
        consumer: { select: { name: true } },
        volumeSoldToProducers: {
          select: {
            soldAmount: true, // Correct placement of soldAmount
            consumers: { select: { name: true } },
            producers: { select: { name: true } },
          },
        },
        actualProduces: {
          select: {
            actualProduction: true,
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: {
        createdAt: "desc", // Orders by createdAt field in descending order
      },
    }),
    prisma.volume.count({ where: query }),
  ]);

  // const [data, count] = await prisma.$transaction([
  //   prisma.volumeSoldToProducer.findMany({
  //     where: query,
  //     include: {
  //       // volumeSoldToProducers: {
  //       //   select: {
  //       //     soldAmount: true,
  //       //     consumer: { select: { name: true } },
  //       //     producer: { select: { name: true } },
  //       //   },
  //       // },
  //       volume: true,
  //     },
  //     take: ITEM_PER_PAGE,
  //     skip: ITEM_PER_PAGE * (p - 1),
  //   }),
  //   prisma.volumeSoldToProducer.count({ where: query }),
  // ]);

  return (
    <div className="p-6 bg-white border min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <p className="text-sm text-gray-500">View and manage reports</p>
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

      <TabListContainer />
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* No need to pass handlers, UploadCSV now handles its own logic */}
      {/* <Upload /> */}

      <Pagination page={p} count={count} />
    </div>
  );
};

export default VolumeListPage;
