import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserRegisterFormSchema,
  type UserRegisterFormType,
} from "@/lib/schemas/validation";
import { createClient } from "@/lib/supabase/client";

export function useSignUpForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  // 1. Inicializa React Hook Form con el schema de Zod
  const form = useForm<UserRegisterFormType>({
    resolver: zodResolver(UserRegisterFormSchema),
    defaultValues: {
      email: "asdasd",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched", 
  });

  const { isSubmitting } = form.formState;

  const handleSignUp = async (values: UserRegisterFormType) => {
    setServerError(null);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });

      if (error) throw error;

      router.push("/auth/sign-up-success");
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Ha ocurrido un error inesperado.";
      setServerError(errorMessage);
      console.error("Sign up error:", errorMessage);
    }
  };

  return {
    form,
    handleSignUp,
    isSubmitting,
    serverError,
  };
}
