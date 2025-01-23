import { FaBriefcase, FaChartBar, FaFileInvoice } from "react-icons/fa";
import OverviewBox from "./OverviewBox";

const overviewData = [
  {
    title: "Sold",
    count: 0,
    color: "#A3A3A3",
    icon: <FaChartBar className="text-white" />,
  },
  {
    title: "Unsold",
    count: 0,
    color: "#3B82F6",
    icon: <FaFileInvoice className="text-white" />,
  },
  {
    title: "Actual Production",
    count: 0,
    color: "#1E293B",
    icon: <FaBriefcase className="text-white" />,
  },
];

const OverviewBoxContainerProducer = async () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {overviewData.map((data, index) => (
        <OverviewBox
          key={index}
          icon={data.icon}
          color={data.color}
          title={data.title}
          count={data.count}
        />
      ))}
    </div>
  );
};

export default OverviewBoxContainerProducer;
