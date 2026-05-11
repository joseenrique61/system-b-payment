import { redirect } from '@sveltejs/kit';
import { AUTH_KEYCLOAK_ID, AUTH_KEYCLOAK_ISSUER } from "$env/static/private";

export const GET = async () => {
    // 1. Logout URL for Keycloak
    const logoutUrl = `${AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/logout`;
    
    // 2. Return parameters for Keycloak
    const params = new URLSearchParams({
        client_id: AUTH_KEYCLOAK_ID,
        post_logout_redirect_uri: 'http://localhost:5173/auth/callback-signout'
    });

    // 3. Redirect to Keycloak to close the global session
    throw redirect(302, `${logoutUrl}?${params.toString()}`);
};