import Link from "next/link";
import React from "react";
import ResetPasswordForm from "./ResetPasswordForm";

const ResetPasswordPage = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 w-full">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Reset Your Password
        </h1>
        <ResetPasswordForm />
        
      </div>
    </section>
  );
};

export default ResetPasswordPage;
