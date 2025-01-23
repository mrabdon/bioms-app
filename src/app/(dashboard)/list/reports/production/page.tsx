import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Tab from "@/components/Tab";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import TabListContainer from "@/components/TabListContainer";
import { getGroupedVolumes } from "@/lib/actions";
import { Prisma, Volume, Consumer, VolumeSoldToProducer } from "@prisma/client";

type VolumeList = Volume & {
  producer: Producer;
  consumer: Consumer;
  volumeSoldToProducers: VolumeSoldToProducer[];
};

interface Producer {
  id: string;
  name: string;
  shortName: string;
  location: string;
  material: string;
}

const producers: Producer[] = [
  {
    id: "2024000001",
    name: "San Carlos Bioenergy, Inc.",
    shortName: "SCBI",
    location: "San Carlos City, Negros Occidental",
    material: "Sugarcane",
  },
  {
    id: "2024000002",
    name: "Leyte Agri Corp.",
    shortName: "LAC",
    location: "Ormoc City, Leyte",
    material: "Molasses",
  },
  {
    id: "2024000003",
    name: "Roxol Bioenergy Corp.",
    shortName: "RBC",
    location: "La Carlota City, Negros Occidental",
    material: "Molasses",
  },
  {
    id: "2024000004",
    name: "Green Future Innovations, Inc.",
    shortName: "GFII",
    location: "San Mariano, Isabela",
    material: "Sugarcane",
  },
  {
    id: "2024000005",
    name: "Balayan Distillery, Incorporated",
    shortName: "BDI",
    location: "Calaca, Batangas",
    material: "Molasses",
  },
  {
    id: "2024000006",
    name: "Far East Alcohol Corporation",
    shortName: "FEAC",
    location: "Apalit, Pampanga",
    material: "Molasses",
  },
  {
    id: "2024000007",
    name: "Kooll Company Inc.",
    shortName: "KCI",
    location: "Talisay City, Negros Occidental",
    material: "Molasses",
  },
  {
    id: "2024000008",
    name: "Universal Robina Corporation",
    shortName: "URC",
    location: "Bais City, Negros Oriental",
    material: "Molasses",
  },
  {
    id: "2024000009",
    name: "Absolut Distillers Inc.",
    shortName: "ADI",
    location: "Lian, Batangas",
    material: "Molasses",
  },
  {
    id: "2024000010",
    name: "Progreen Agricorp Inc. - Nasugbu",
    shortName: "PAIN",
    location: "Nasugbu, Batangas",
    material: "",
  },
  {
    id: "2024000011",
    name: "Progreen Agricorp Inc. - Balayan",
    shortName: "PAIB",
    location: "Balayan, Batangas",
    material: "",
  },
  {
    id: "2024000012",
    name: "Victorias Milling Company, Inc.",
    shortName: "VMCI",
    location: "Victorias City, Negros Occidental",
    material: "",
  },
  {
    id: "2024000013",
    name: "Asian Alcohol Corporation",
    shortName: "AAC",
    location: "Alijis Road Bacolod, Negros Occidental",
    material: "",
  },
];

function getProducerNameById(producerId: string): string | null {
  const producer = producers.find((p) => p.id === producerId);
  return producer ? producer.name : null;
}

const tabs = [
  { label: "All Volumes", value: "volumes", link: "/list/reports" },
  { label: "Sales Analysis", value: "sales", link: "/list/reports/sales" },
  {
    label: "Production Analysis",
    value: "production",
    link: "/list/reports/production",
  },
];

const ProductionListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const columns = [
    {
      header: "CLIENT'S NAME",
      accessor: "client",
      className: "p-4",
    },
    {
      header: "Year",
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
    // {
    //   header: "Sold",
    //   accessor: "sold",
    //   className: "hidden lg:table-cell",
    // },
    // {
    //   header: "Unsold",
    //   accessor: "unsold",
    //   className: "hidden lg:table-cell",
    // },
  ];
  const renderRow = (group: any) => (
    <tr
      key={group.producerId}
      className="border-b text-sm border-gray-200 even:bg-slate-50 font-medium hover:bg-gray-100"
    >
      {/* Grouped columns */}
      <td className="hidden md:table-cell gap-2 p-4">
        {" "}
        {getProducerNameById(group.producerId)}
      </td>
      <td className="flex items-center gap-2 p-4">2021</td>{" "}
      {/* Add actual field for client's name */}
      <td>{group._sum?.committedVolume ?? 0}</td>
      {/* <td>{group._sum?.actualProduction ?? 0}</td> */}
      <td>{group._sum?.begInventory ?? 0}</td>
      <td>{group._sum?.totalStock ?? 0}</td>
      {/* <td>{group._sum?.sold ?? 0}</td> */}
      <td>{group._sum?.unsold ?? 0}</td>
      <td>{group.soldTo}</td>
      <td>
        <div className="flex items-center gap-2">
          {group.role === "admin" && (
            <>
              <FormContainer table="volume" type="update" data={group} />
              <FormContainer
                table="volume"
                type="delete"
                id={group.producerId}
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  let query: Prisma.VolumeSoldToProducerWhereInput = {};
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

  // Fetch the grouped volumes using the getGroupedVolumes function
  const groupedVolumes = await getGroupedVolumes();

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
      <Table columns={columns} renderRow={renderRow} data={groupedVolumes} />

      <Pagination page={p} count={groupedVolumes.length} />
    </div>
  );
};

export default ProductionListPage;
