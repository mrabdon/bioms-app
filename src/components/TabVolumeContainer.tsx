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
    label: "Actual Volumes",
    value: "actual",
    link: "/list/volumes/actual",
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
