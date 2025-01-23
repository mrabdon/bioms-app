"use client";

import { usePathname } from "next/navigation";
import Tab from "./Tab";

const tabsData = [
  { label: "Dashboard", value: "dashboard", link: "/admin" },
  { label: "Committed", value: "committed", link: "/admin/committed" },
];

const TabContainer = async () => {
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

export default TabContainer;
