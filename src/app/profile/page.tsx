import { logoutAction } from "@/actions/auth.action";
import { auth } from "@/auth";

const ProfilePage = async () => {
  const session = await auth();

  return (
    <section className="flex items-center justify-center min-h-[60vh] px-4">
      {session?.user && (
        <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 text-center">
          <p>{JSON.stringify(session)}</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile</h1>
          <p className="text-gray-700 mb-2">
            Welcome, <span className="font-semibold">{session.user.name}</span>!
          </p>
          <p className="text-gray-600 mb-6">Email: {session.user.email}</p>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Logout
            </button>
          </form>
        </div>
      )}

      {!session?.user && (
        <p className="text-gray-600">You are not logged in.</p>
      )}
    </section>
  );
};

export default ProfilePage;
