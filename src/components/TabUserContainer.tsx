"use client";

import { usePathname } from "next/navigation";
import Tab from "./Tab";

const tabsData = [
  {
    label: "Admin",
    value: "admin",
    link: "/list/users",
  },
  {
    label: "Producer",
    value: "producer",
    link: "/list/users/producer",
  },
  {
    label: "Staff",
    value: "staff",
    link: "/list/users/staff",
  },
];

const TabUserContainer = async () => {
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

export default TabUserContainer;
