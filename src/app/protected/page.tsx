import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/sign-out-button";
import { cookies } from "next/headers";

export default async function ProtectedPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 items-center">
      <div className="w-full">
        <div className="py-6 font-bold bg-purple-950 text-center">
          Esta es una página protegida que solo puedes ver como usuario
          autenticado.
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-6">
        <p>
          Hola <strong>{data.user.email}</strong>
        </p>
        <SignOutButton />
      </div>
    </div>
  );
}
