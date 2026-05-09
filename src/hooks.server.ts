import { SvelteKitAuth } from "@auth/sveltekit";
import Keycloak from "@auth/sveltekit/providers/keycloak";
import { AUTH_KEYCLOAK_ID, AUTH_KEYCLOAK_SECRET, AUTH_KEYCLOAK_ISSUER } from "$env/static/private";

// IMPORTANTE: Nota las llaves { handle } en el export
export const { handle } = SvelteKitAuth({
  providers: [
    Keycloak({
      clientId: AUTH_KEYCLOAK_ID,
      clientSecret: AUTH_KEYCLOAK_SECRET,
      issuer: AUTH_KEYCLOAK_ISSUER,
    }),
  ],
  // Si necesitas añadir más lógica a la sesión (como roles)
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
      }
      return session;
    },
  },
  // Opcional: Para evitar problemas de confianza en localhost con Docker
  trustHost: true
});