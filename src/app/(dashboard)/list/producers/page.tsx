import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { Prisma, Producer, User } from "@prisma/client";
import { ITEM_PER_PAGE } from "@/lib/settings";
import FormContainer from "@/components/FormContainer";
import { auth } from "@clerk/nextjs/server";

type ProducerList = Producer & { users: User[] };

const renderRow = (item: ProducerList) => (
  <tr
    key={item.id}
    className="border-b text-sm border-gray-200  font-medium hover:bg-gray-100"
  >
    <td className="items-center gap-2 p-4">{item.id}</td>
    <td className="items-center gap-2 p-4">{item.name}</td>
    <td className="items-center gap-2 p-4">{item.alias}</td>
    <td className="items-center gap-2 p-4">{item.address}</td>
    <td className="items-center gap-2 p-4">{item.feedstock}</td>
    <td>
      <div className="flex items-center gap-2">
        {role === "admin" && (
          <>
            <FormContainer table="producer" type="update" data={item} />
            <FormContainer table="producer" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);
const ProducerListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const columns = [
    {
      header: "ID",
      accessor: "id",
      className: "hidden md:table-cell p-4",
    },

    {
      header: "NAME",
      accessor: "companyName",
      className: "p-4",
    },
    {
      header: "ALIAS",
      accessor: "alias",
      className: "p-4",
    },
    {
      header: "LOCATION",
      accessor: "location",
      className: "p-4",
    },
    {
      header: "FEEDSTOCK",
      accessor: "feedstock",
      className: "p-4",
    },

    {
      header: "",
      accessor: "action",
      className: "",
    },
  ];

  let query: Prisma.ProducerWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            // Convert the value into a regex-like pattern and use contains for partial matching
            query.name = {
              contains: value, // Use the search value directly
              mode: "insensitive", // Case-insensitive search
            };
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
        users: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.producer.count({ where: query }),
  ]);

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
        <TableSearch />
        {role === "admin" && (
          // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
          //   <Image src="/plus.png" alt="" width={14} height={14} />
          // </button>
          <FormContainer table="producer" type="create" />
        )}
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};
export default ProducerListPage;
