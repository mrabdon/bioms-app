import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { Company, Prisma, Producer } from "@prisma/client";
import { ITEM_PER_PAGE } from "@/lib/settings";
import FormContainer from "@/components/FormContainer";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import TabUserContainer from "@/components/TabUserContainer";

type ProducerList = Producer & { company: Company };

const ProducerListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;
  //URL PARAMS CONDITION

  let query: Prisma.ProducerWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            // Combine both conditions into a single query object
            query.OR = [];
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.producer.findMany({
      where: query,
      include: {
        company: { select: { name: true } },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.producer.count({ where: query }),
  ]);
  const columns = [
    {
      header: "INFO",
      accessor: "info",
      className: "p-4",
    },
    {
      header: "DATE ADDED",
      accessor: "invitation",
      className: "",
    },

    {
      header: "STATUS",
      accessor: "status",
      className: "hidden lg:table-cell",
    },
    {
      header: "COMPANY NAME",
      accessor: "company",
      className: "hidden lg:table-cell",
    },
    ...(role === "admin" || role === "producer"
      ? [
          {
            header: "",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: ProducerList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 font-medium hover:bg-gray-100"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.img || "/noAvatar.png"}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item?.firstName} {item?.lastName}
          </h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>

      <td className="hidden lg:table-cell">
        {item.createdAt?.toString().slice(4, 7)}{" "}
        {item.createdAt?.toString().slice(8, 10)},{" "}
        {item.createdAt?.toString().slice(11, 15)}
      </td>

      {/* Status Column with INVITED Badge - responsive */}
      <td className=" lg:table-cell flex items-center justify-center">
        <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-orange-600 bg-orange-100 rounded-full">
          <span className="w-2.5 h-2.5 mr-2 bg-orange-500 rounded-full"></span>
          REGISTERED
        </div>
      </td>

      <td className="hidden lg:table-cell">{item.company?.name || "-"}</td>

      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "producer") && (
            <>
              <FormContainer table="producer" type="update" data={item} />
              <FormContainer table="producer" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
  return (
    <div className="p-6 bg-white border min-h-screen">
      {/* TOP */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-800">Producers</h1>
          <p className="text-sm text-gray-500">View and manage producers</p>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="sm:flex sm:items-center justify-between mb-4 gap-4">
        <div className="flex w-full sm:w-auto gap-4">
          <TableSearch />
        </div>
        {(role === "admin" || role === "producer") && (
          <FormContainer table="producer" type="create" />
        )}
      </div>
      <TabUserContainer />
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};
export default ProducerListPage;
