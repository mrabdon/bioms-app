"use client";
import { useState } from "react";

const ChangePasswordPage = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (field: string) => {
    if (field === "old") {
      setShowOldPassword(!showOldPassword);
    } else if (field === "new") {
      setShowNewPassword(!showNewPassword);
    } else if (field === "confirm") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-start p-6">
      {/* Top Section: Title and Description */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Change Password
        </h1>
        <p className="text-sm text-gray-500 text-center">
          Change your password here
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full mx-auto">
        <form>
          {/* Old Password */}
          <div className="flex items-center gap-4 mb-4">
            <label
              htmlFor="old-password"
              className="text-sm text-gray-700 w-32"
            >
              Old Password
            </label>
            <div className="w-full">
              <input
                id="old-password"
                type={showOldPassword ? "text" : "password"}
                placeholder="Enter Old Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={showOldPassword}
                  onChange={() => togglePasswordVisibility("old")}
                  className="mr-2"
                />
                <label className="text-sm cursor-pointer">Show</label>
              </div>
            </div>
          </div>

          {/* New Password */}
          <div className="flex items-center gap-4 mb-4">
            <label
              htmlFor="new-password"
              className="text-sm text-gray-700 w-32"
            >
              New Password
            </label>
            <div className="w-full">
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter New Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={showNewPassword}
                  onChange={() => togglePasswordVisibility("new")}
                  className="mr-2"
                />
                <label className="text-sm cursor-pointer">Show</label>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex items-center gap-4 mb-6">
            <label
              htmlFor="confirm-password"
              className="text-sm text-gray-700 w-32"
            >
              Confirm Password
            </label>
            <div className="w-full">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={showConfirmPassword}
                  onChange={() => togglePasswordVisibility("confirm")}
                  className="mr-2"
                />
                <label className="text-sm cursor-pointer">Show</label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
