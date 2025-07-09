"user client";

import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

type Provider = "google" | "github";

const SocialProviders = () => {
  const socialLoginHandler = (provider: Provider) => {
    signIn(provider, {
      redirectTo: "/profile",
    });
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-2">
      <button
        type="button"
        className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition"
      >
        <FcGoogle className="text-xl" />
        <span className="hidden sm:inline">Google</span>
      </button>

      <button
        onClick={() => socialLoginHandler("github")}
        type="button"
        className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition"
      >
        <FaGithub className="text-xl" />
        <span className="hidden sm:inline">GitHub</span>
      </button>
    </div>
  );
};

export default SocialProviders;
