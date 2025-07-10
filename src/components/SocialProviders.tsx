"user client";

import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

type Provider = "google" | "github";

const SocialProviders = () => {
  const socialLoginHandler = (provider: Provider) => {
    if (provider !== "google" && provider !== "github") {
      console.error("Unsupported provider");
      return;
    }
    if (provider === "google") {
      signIn("google", {
        redirectTo: "/profile",
      });
      return;
    } else {
      signIn("github", {
        redirectTo: "/profile",
      });
      return;
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-2">
      <button
        onClick={() => socialLoginHandler("google")}
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
