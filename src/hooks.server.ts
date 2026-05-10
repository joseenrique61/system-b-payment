import { SvelteKitAuth } from '@auth/sveltekit';
import Keycloak from '@auth/sveltekit/providers/keycloak';
import { AUTH_KEYCLOAK_ID, AUTH_KEYCLOAK_SECRET, AUTH_KEYCLOAK_ISSUER } from '$env/static/private';

// IMPORTANTE: Nota las llaves { handle } en el export
export const { handle } = SvelteKitAuth({
	providers: [
		Keycloak({
			clientId: AUTH_KEYCLOAK_ID,
			clientSecret: AUTH_KEYCLOAK_SECRET,
			issuer: AUTH_KEYCLOAK_ISSUER
		})
	],
	// Si necesitas añadir más lógica a la sesión (como roles)
	callbacks: {
		async jwt({ token, profile }) {
			// Si el mapper de Keycloak funciona, los roles vendrán en el profile
      console.log(token)
			if (profile) {
        token.id = (profile as any).sub;
				token.roles = (profile as any).roles || [];
			}
			return token;
		},
		async session({ session, token }) {
			// Pasamos los roles del token a la sesión de la UI
			if (session.user) {
        (session.user as any).id = token.id as string;
				(session.user as any).roles = token.roles;
			}
			return session;
		}
	},
	// Opcional: Para evitar problemas de confianza en localhost con Docker
	trustHost: true
});
