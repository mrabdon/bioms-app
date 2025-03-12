"use client";

import { usePathname } from "next/navigation";
import Tab from "./Tab";

const tabsData = [
  {
    label: "Committed Volumes",
    value: "committed",
    link: "/list/volumes",
  },
  {
    label: "Actual Produce",
    value: "produce",
    link: "/list/volumes/produce",
  },
  {
    label: "Sold",
    value: "sold",
    link: "/list/volumes/sold",
  },
  {
    label: "Lift",
    value: "lift",
    link: "/list/volumes/lift",
  },
];

const TabVolumeContainer = async () => {
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

export default TabVolumeContainer;
