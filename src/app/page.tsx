import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <section>
      <h1 className="text-slate-800 font-bold text-5xl">Home Page</h1>
      <div className="text-center mt-7">
        <Link
          href="/login"
          className="underline rounded-lg text-blue-500 hover:underline"
        >
          Go to Login Page
        </Link>
        
      </div>
    </section>
  );
};

export default page;
