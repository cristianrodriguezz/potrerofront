import { createClient } from "@/lib/supabase/client";

/**
 * Una instancia de 'fetch' personalizada que automáticamente añade el token de autenticación de Supabase.
 * Deberías usar esta función para todas las llamadas a tu API protegida.
 * @param url La URL del endpoint de la API.
 * @param options Opciones de fetch, como method, headers, body, etc.
 * @returns Una promesa que resuelve con la respuesta de la API.
 */
export const fetchWithAuth = async (
  url: string | URL,
  options: RequestInit = {}
): Promise<Response> => {
  const supabase = createClient();
  
  // Obtenemos la sesión actual del usuario desde el cliente de Supabase
  const { data: { session } } = await supabase.auth.getSession();

  // Si no hay sesión, podemos decidir si lanzar un error o continuar sin token
  if (!session) {
    console.warn("No hay sesión de Supabase activa. Realizando petición sin token.");
    // Podrías lanzar un error si todas tus rutas están protegidas:
    // throw new Error("Usuario no autenticado.");
  }

  const token = session?.access_token;

  // Creamos los headers, fusionando los que ya existían con el de autorización
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Realizamos la llamada a fetch con los nuevos headers
  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
};
