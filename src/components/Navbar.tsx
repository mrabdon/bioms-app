import prisma from "@/lib/prisma";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { User } from "@prisma/client";
import Image from "next/image";

const Navbar = async () => {
  const user = await currentUser();

  // Fetch user data from Prisma, including the image
  const userFromDb =
    user &&
    (await prisma.user.findUnique({
      where: { id: user.id }, // Assuming email is used to identify the user
      select: { img: true, firstname: true },
    }));

  const imageUrl = userFromDb?.img
    ? `${userFromDb.img}?w=36&h=36&c=fill`
    : "/noAvatar.png";

  return (
    <div className="w-full bg-white border">
      <div className="flex items-center justify-between p-4">
        {/* SEARCH BAR */}
        {/* <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <Image src="/search.png" alt="" width={14} height={14} />
      <input
        type="text"
        placeholder="Search..."
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </div> */}
        {/* ICONS AND USER */}
        <div className="flex items-center gap-6 justify-end w-full">
          {/* <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
        <Image src="/message.png" alt="" width={20} height={20} />
      </div>
      <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
        <Image src="/announcement.png" alt="" width={20} height={20} />
        <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
          1
        </div>
      </div> */}

          {/* <div className="flex flex-col">
            <span className="text-xs leading-3 font-medium">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-[10px] text-gray-500 text-right">
              {user?.publicMetadata.role as string}
            </span>
          </div>

          <div className="relative w-9 h-9 rounded-full overflow-hidden">
            <Image
              src={userFromDb?.img || "/noAvatar.png"}
              alt="User avatar"
              layout="fill"
              objectFit="cover"
            />
          </div> */}

          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-xs leading-3 font-medium">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-[10px] text-gray-500 text-right">
                {user?.publicMetadata.role as string}
              </span>
            </div>
            {userFromDb?.img ? (
              <Image
                src={userFromDb?.img}
                alt={user?.firstName || ""}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-medium">
                {user?.firstName &&
                  user.firstName
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase())
                    .join("")}
              </div>
            )}
          </div>
          {/* <UserButton /> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
