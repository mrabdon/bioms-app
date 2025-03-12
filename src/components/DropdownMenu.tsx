"use client";

import { useState } from "react";
import MenuLink from "./MenuLink";

interface DropdownMenuProps {
  label: string;
  icon?: string;
  subItems: { label: string; href: string | undefined }[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  label,
  icon,
  subItems,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-100"
      >
        <div className="flex items-center gap-2">
          {icon && <img src={icon} alt={label} width={20} height={20} />}
          <span className="font-medium text-gray-700">{label}</span>
        </div>
        <span className="text-gray-500">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Sub-items Dropdown */}
      {isOpen && (
        <div className="ml-6 flex flex-col border-l-2 border-gray-200">
          {subItems.map((subItem) => (
            <MenuLink
              key={subItem.label}
              href={subItem.href}
              label={subItem.label}
              icon=""
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
