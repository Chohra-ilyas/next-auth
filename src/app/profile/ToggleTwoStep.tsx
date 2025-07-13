"use client";

import { toggleTwoStepAction } from "@/actions/auth.action";
import { useState } from "react";
import toast from "react-hot-toast";

interface ToggleTwoStepProps {
  userId: string;
  isTwoStepEnabled: boolean;
}

const ToggleTwoStep = ({ userId, isTwoStepEnabled }: ToggleTwoStepProps) => {
  const [isEnabled, setIsEnabled] = useState(isTwoStepEnabled);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toggleTwoStepAction(userId, isEnabled)
      .then(() => {
        toast.success(
          `Two-Step Verification has been ${
            isEnabled ? "enabled" : "disabled"
          } successfully.`
        );
      })
      .catch((error) => {
        console.error("Error toggling Two-Step Verification:", error);
        toast.error("Failed to update Two-Step Verification status.");
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center flex-col gap-4 max-w-sm mx-auto p-4 rounded-xl"
    >
      <label
        htmlFor="two-step-toggle"
        className="flex items-center justify-between gap-3"
      >
        <span className="text-gray-700 font-medium">
          Enable/Disable Two-Step Verification
        </span>
        <input
          id="two-step-toggle"
          type="checkbox"
          checked={isEnabled}
          onChange={(e) => setIsEnabled(e.target.checked)}
          className="h-5 w-5 accent-blue-600"
        />
      </label>

      <button
        type="submit"
        className="w-40 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
      >
        Save
      </button>
    </form>
  );
};

export default ToggleTwoStep;
