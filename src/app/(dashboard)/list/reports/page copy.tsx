// pages/volumeListPage.tsx
import ExportExcel from "@/components/ExportExcel";
import ExportPDF from "@/components/ExportPDF";
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
  Produce,
  Sold,
  Company,
} from "@prisma/client";

type VolumeList = Volume & { produces: Produce[] } & {
  companies: Company[];
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
      accessor: "begInventory",
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
    // {
    //   header: "Sold to",
    //   accessor: "soldTo",
    //   className: "hidden lg:table-cell",
    // },
  ];

  const renderRow = (item: VolumeList) => (
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
        {item.produces.map((actual) => actual.actualProduction) || 0}
      </td>
      <td className="hidden md:table-cell ">
        {item.begInventory?.toLocaleString() || 0}
      </td>
      <td className="hidden md:table-cell ">
        {item.totalStock?.toLocaleString() || 0}
      </td>
      <td className="hidden md:table-cell ">
        {item.solds
          .map((volumeSold) => volumeSold.soldAmount)
          .toLocaleString() || 0}
      </td>
      <td className="hidden md:table-cell ">
        {item.unsold?.toLocaleString() || 0}
      </td>
      {/* <td className="hidden md:table-cell ">
        {" "}
        {item.solds
          .map((volumeSold) => volumeSold.consumerId)
          .toLocaleString() || "-"}
      </td> */}
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
        companies: true,
        solds: true,
        produces: true,
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
      <div className="flex gap-x-4 mt-4">
        <ExportExcel data={data} fileName="Bioethanol_Volumes" />
        <ExportPDF />
      </div>

      <Pagination page={p} count={count} />
    </div>
  );
};

export default VolumeListPage;
