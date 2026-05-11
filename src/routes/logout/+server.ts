// src/routes/logout/+server.ts
import { redirect } from '@sveltejs/kit';
import { AUTH_KEYCLOAK_ID, AUTH_KEYCLOAK_ISSUER } from "$env/static/private";

export const GET = async ({ locals }) => {
    // 1. URL de cierre de sesión de Keycloak
    // Estructura: {issuer}/protocol/openid-connect/logout
    const logoutUrl = `${AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/logout`;
    
    // 2. Parámetros necesarios para que Keycloak sepa a dónde volver
    const params = new URLSearchParams({
        client_id: AUTH_KEYCLOAK_ID,
        post_logout_redirect_uri: 'http://localhost:5173/login'
    });

    // 3. Redirigir a Keycloak para cerrar la sesión global
    throw redirect(302, `${logoutUrl}?${params.toString()}`);
};