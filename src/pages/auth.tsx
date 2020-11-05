import React from "react";
import { signIn, signOut, useSession } from "next-auth/client";

export default function myComponent() {
  const [session, loading] = useSession();
  if (loading) {
    return <p>Loading</p>;
  }

  return (
    <>
      {!session && (
        <>
          Not signed in <br />
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => signIn()}
          >
            Sign in
          </button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => signOut}>
            Sign out
          </button>
        </>
      )}
    </>
  );
}
