// components/MenuLink.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuLinkProps {
  href: string;
  icon: string;
  label: string;
}

const MenuLink = ({ href, icon, label }: MenuLinkProps) => {
  const pathname = usePathname();

  // Check if the current pathname matches or starts with the href
  const isActive = pathname === href || pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center justify-center lg:justify-start gap-4 py-2 md:px-2 rounded-md ${
        isActive
          ? "bg-lamaSkyLight text-blue-600"
          : "text-gray-500 hover:bg-lamaSkyLight"
      }`}
    >
      <Image src={icon} alt={label} width={20} height={20} />
      <span className="hidden lg:block">{label}</span>
    </Link>
  );
};

export default MenuLink;
