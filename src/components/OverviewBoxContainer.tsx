import prisma from "@/lib/prisma";
import OverviewBox, { OverviewBoxProps } from "./OverviewBox";
import {
  FaBriefcase,
  FaChartBar,
  FaFileInvoice,
  FaProjectDiagram,
  FaUsers,
} from "react-icons/fa";

const OverviewBoxContainer = async () => {
  const producersCount = await prisma.producer.count();
  const consumerCount = await prisma.consumer.count();
  const userCount = await prisma.user.count();

  const totalActualProduction = await prisma.actualProduce.aggregate({
    _sum: {
      actualProduction: true,
    },
  });

  const totalSold = await prisma.volumeSoldToProducer.aggregate({
    _sum: {
      soldAmount: true,
    },
  });

  const totalUnsold = await prisma.volume.aggregate({
    _sum: {
      unsold: true,
    },
  });

  const formattedTotalActualProduction = totalActualProduction._sum
    .actualProduction
    ? totalActualProduction._sum.actualProduction.toLocaleString()
    : "0";

  const resultActual = formattedTotalActualProduction;

  const formattedTotalSold = totalSold._sum.soldAmount
    ? totalSold._sum.soldAmount.toLocaleString()
    : "0";

  const resultSold = formattedTotalSold;

  const formattedTotalUnsold = totalUnsold._sum.unsold
    ? totalUnsold._sum.unsold.toLocaleString()
    : "0";

  const resultUnsold = formattedTotalUnsold;

  const overviewData = [
    {
      title: "Producers",
      count: producersCount,
      color: "#FDBA74",
      icon: <FaUsers className="text-white text-lg" />,
    },
    {
      title: "Users",
      count: userCount,
      color: "#34D399",
      icon: <FaUsers className="text-white text-lg" />,
    },
    {
      title: "Oil Companies",
      count: consumerCount,
      color: "#FB7185",
      icon: <FaProjectDiagram className="text-white text-lg" />,
    },
    {
      title: "Unsold",
      count: parseFloat(resultUnsold),
      color: "#A3A3A3",
      icon: <FaChartBar className="text-white text-lg" />,
    },
    {
      title: "Sold",
      count: parseFloat(resultSold),
      color: "#3B82F6",
      icon: <FaFileInvoice className="text-white text-lg" />,
    },
    {
      title: "Actual Production",
      count: parseFloat(resultActual),
      color: "#1E293B",
      icon: <FaBriefcase className="text-white text-lg" />,
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {overviewData.map((item, index) => (
        <OverviewBox
          key={index}
          icon={item.icon}
          color={item.color}
          title={item.title}
          count={item.count}
        />
      ))}
    </div>
  );
};

export default OverviewBoxContainer;
