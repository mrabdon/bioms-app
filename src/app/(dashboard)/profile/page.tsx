import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { useState } from "react";

// Dummy data for the user
const userData = {
  name: "John Doe",
  email: "johndoe@example.com",
  username: "johndoe123",
  company: "Example Corp",
  img: "/defaultAvatar.jpg", // Placeholder image
};

const UserProfilePage = async () => {
  const user = await currentUser();
  // Fetch user data from Prisma, including the image
  const userFromDb =
    user &&
    (await prisma.user.findUnique({
      where: { id: user.id }, // Assuming email is used to identify the user
      select: { img: true },
    }));

  const imageUrl = userFromDb?.img
    ? `${userFromDb.img}?w=36&h=36&c=fill`
    : "/noAvatar.png";

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          {/* Profile Image */}
          <div className="relative mb-4">
            {userFromDb?.img ? (
              <Image
                src={userFromDb?.img}
                alt={user?.firstName || ""}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-purple-500 text-white rounded-full flex items-center justify-center font-medium">
                {user?.firstName &&
                  user.firstName
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase())
                    .join("")}
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-sm text-gray-600">{}</p>
        </div>

        {/* Personal Information */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-semibold text-gray-700">
            Personal Information
          </h3>
          <div className="flex gap-4">
            <p className="text-sm text-gray-600">Username:</p>
            <p className="text-sm text-gray-800">{user?.username}</p>
          </div>
          <div className="flex  gap-4">
            <p className="text-sm text-gray-600">Name:</p>
            <p className="text-sm text-gray-800">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
          <div className="flex  gap-4">
            <p className="text-sm text-gray-600">Company:</p>
            <p className="text-sm text-gray-800">
              {user?.publicMetadata.role as string}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
