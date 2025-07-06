import Link from "next/link";
import React from "react";
import RegisterForm from "./RegisterForm";

const RegisterPage = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Register</h1>
        <RegisterForm />
        <p className="mt-4 text-center text-gray-600">
          Already have an account?
          <Link href="/login" className="ml-1 text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
