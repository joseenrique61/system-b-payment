import { SvelteKitAuth } from '@auth/sveltekit';
import Keycloak from '@auth/sveltekit/providers/keycloak';
import { AUTH_KEYCLOAK_ID, AUTH_KEYCLOAK_SECRET, AUTH_KEYCLOAK_ISSUER } from '$env/static/private';
import { supabase } from '$lib/supabase';

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
		async signIn({ profile }) {
			if (!profile?.sub) return false;
			try {
				// JIT Provisioning: Verificar si el usuario existe en Supabase
				const { data: existingUser } = await supabase
					.from('profiles')
					.select('id')
					.eq('id', profile.sub)
					.single();

				if (!existingUser) {
					// Si no existe, lo creamos automáticamente
					const { error } = await supabase.from('profiles').insert([
						{
							id: profile.sub,
							// email: profile.preferred_username,
							full_name: profile.name
						}
					]);

					if (error) {
						console.error('Error creando perfil en Supabase:', error.message);
						return false; // Bloquea el inicio de sesión si no se puede crear el perfil
					}
					console.log('>>> Nuevo perfil creado en Sistema B:', profile.sub);
				}

				return true; // Permitir el inicio de sesión
			} catch (err) {
				console.error('Error en JIT Provisioning:', err);
				return false;
			}
		},
		async jwt({ token, profile }) {
			// Si el mapper de Keycloak funciona, los roles vendrán en el profile
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
