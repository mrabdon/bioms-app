"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export type TabProps = {
  label: string;
  value: string;
  link: string;
};

const Tab = async ({ label, value, link }: TabProps) => {
  const pathname = usePathname();

  return (
    <Link
      key={value}
      href={link}
      className={`px-4 py-2 ${
        pathname === link
          ? "border-b-2 border-purple-500 font-semibold"
          : "text-gray-500"
      }`}
    >
      {label}
    </Link>
  );
};

export default Tab;
