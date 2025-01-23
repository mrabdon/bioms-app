"use client";

import { usePathname } from "next/navigation";
import Tab from "./Tab";

const tabsData = [
  { label: "All Volumes", value: "volumes", link: "/list/reports" },
  { label: "Sales Analysis", value: "sales", link: "/list/reports/sales" },
  {
    label: "Production Analysis",
    value: "production",
    link: "/list/reports/production",
  },
];

const TabListContainer = async () => {
  const pathname = usePathname();

  return (
    <div className="flex border-b mb-4">
      {tabsData.map((data, index) => (
        <Tab
          key={index}
          label={data.label}
          value={data.value}
          link={data.link}
        />
      ))}
    </div>
  );
};

export default TabListContainer;
