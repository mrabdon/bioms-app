import FilterComponent from "@/components/Filter";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import TabContainer from "@/components/TabContainer";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import {
  Company,
  Consumer,
  Prisma,
  Producer,
  Sold,
  Volume,
} from "@prisma/client";

type VolumeList = Volume & { companies: Company[] } & { consumer: Consumer } & {
  sold: Sold[];
};

const CommittedPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const columns = [
    {
      header: "Producer",
      accessor: "committedVolume",
      className: "p-4",
    },
    { header: "Quarter / Year", accessor: "quarter", className: "p-4" },
    { header: "Committed Volume", accessor: "committedVolume", className: "" },
    { header: "Date Created", accessor: "committedVolume", className: "" },
  ];

  const renderRow = (item: VolumeList & { company: Company[] }) => (
    <tr
      key={item.id}
      className="border-b text-sm border-gray-200 even:bg-slate-50 font-medium hover:bg-gray-100"
    >
      <td className="p-4">
        {item.companies.map((company) => (
          <span key={company.id}>{company.name}</span>
        ))}
      </td>
      <td className="flex items-center gap-2 p-4">
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

      <td> {item.committedVolume?.toLocaleString()}</td>
      <td className="hidden md:table-cell">
        {new Date(item.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </td>
    </tr>
  );
  const tabs = [
    { label: "Dashboard", value: "dashboard", link: "/admin" },
    { label: "Committed", value: "committed", link: "/admin/committed" },
  ];
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  let query: Prisma.VolumeWhereInput = {};

  const handleSort = (accessor: string, order: "asc" | "desc" | "") => {
    console.log(`Sorting ${accessor} in ${order} order.`);
    // Add sorting logic here (e.g., update state or fetch sorted data)
  };

  const [data, count] = await prisma.$transaction([
    prisma.volume.findMany({
      where: query,
      include: {
        companies: true,
        consumer: { select: { name: true } },
        solds: {
          select: {
            soldAmount: true, // Correct placement of soldAmount
            consumer: { select: { name: true } },
            Company: { select: { name: true } },
          },
        },
        produces: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.volume.count({ where: query }),
  ]);

  // ✅ Server-side rendering with no direct event handlers passed
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row border bg-white h-screen overflow-hidden">
      <div className="w-full flex flex-col">
        <TabContainer />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-800">
              Committed Volumes
            </h1>
            <p className="text-sm text-gray-500">List</p>
          </div>
        </div>

        {/* Search, Sort, and Filter */}
        <div className="sm:flex sm:items-center justify-between mb-4 gap-4">
          <div className="flex gap-4 w-full">
            <TableSearch />
            {/* <FilterComponent /> */}
          </div>
        </div>

        {/* Data Table */}
        <Table columns={columns} renderRow={renderRow} data={data} />

        {/* Pagination */}
        <Pagination page={p} count={count} />
      </div>
    </div>
  );
};

export default CommittedPage;
