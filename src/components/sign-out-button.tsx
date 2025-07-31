"use client";

import { useFormStatus } from "react-dom";
import { signOut } from "@/app/auth/actions";

export function SignOutButton() {
  const { pending } = useFormStatus();

  return (
    <form action={signOut}>
      <button 
        className="button block bg-red-500 text-white p-2 rounded disabled:opacity-50" 
        type="submit"
        disabled={pending}
      >
        {pending ? "Cerrando sesión..." : "Cerrar Sesión"}
      </button>
    </form>
  );
}
