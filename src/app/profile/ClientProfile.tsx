"use client";

import { useSession } from "next-auth/react";

const ClientProfile = () => {
    const session = useSession();

  return (
    <div>
      {session.data && (
        <div>
          <h2 className="text-xl font-bold">Client Profile</h2>
          <p className="text-gray-700">Name: {JSON.stringify(session.data?.user.name)}</p>
          <p className="text-gray-700">Email: {JSON.stringify(session.data?.user.email)}</p>
        </div>
      )}
    </div>
  )
}

export default ClientProfile