import prisma from "@/lib/prisma";
import FormModal from "./FormModal";

export type FormContainerProps = {
  table:
    | "consumer"
    | "volume"
    | "company"
    | "user"
    | "admin"
    | "producer"
    | "staff"
    | "announcement"
    | "event"
    | "produce"
    | "sold"
    | "lift"
    | "invite";

  type:
    | "create"
    | "update"
    | "invite"
    | "delete"
    | "userTab"
    | "createProduce"
    | "createSold"
    | "createLift"
    | "archive";

  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  if (type !== "delete") {
    switch (table) {
      case "volume":
        const volumeCompany = await prisma.company.findMany({
          select: { id: true, name: true },
        });
        break;
      case "produce":
        const produceCompany = await prisma.company.findMany({
          select: { id: true, name: true },
        });
        relatedData = { produces: produceCompany };
        break;
      case "user":
        const userProducers = await prisma.company.findMany({
          select: { id: true, name: true },
        });
        relatedData = { companys: userProducers };
        break;

      case "announcement":
        const announcementProducers = await prisma.company.findMany({
          select: { id: true, name: true },
        });
        relatedData = { producers: announcementProducers };
        break;
      case "producer":
        const producerCompanies = await prisma.company.findMany({
          select: { id: true, name: true },
        });
        relatedData = { companies: producerCompanies };
        break;
      case "staff":
        const staffCompanies = await prisma.company.findMany({
          select: { id: true, name: true },
        });
        relatedData = { companies: staffCompanies };
        break;
      case "volume":
        // const producerCompanies = await prisma.company.findMany({
        //   select: { id: true, name: true },
        // });
        // relatedData = { companies: producerCompanies };
        break;
      case "produce":
        const produceVolume = await prisma.volume.findMany({
          select: { id: true, quarter: true, year: true },
        });
        relatedData = { produces: produceVolume };
        break;
      case "sold":
        const soldConsumers = await prisma.consumer.findMany({
          select: { id: true, name: true },
        });
        const soldProducers = await prisma.company.findMany({
          select: { id: true, name: true },
        });
        const soldProduces = await prisma.produce.findMany({
          select: { id: true },
        });

        relatedData = {
          consumers: soldConsumers,
          producers: soldProducers,
          produces: soldProduces,
        };
        break;
      case "lift":
        const liftSold = await prisma.sold.findMany({
          select: { id: true },
        });
        relatedData = { sold: liftSold };
      default:
        break;
    }
  }
  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
