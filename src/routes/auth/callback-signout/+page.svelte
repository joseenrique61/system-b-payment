<script lang="ts">
    import { signOut } from "@auth/sveltekit/client";

    // Usamos la runa $effect de Svelte 5 para disparar el cierre local al cargar
    $effect(() => {
        // signOut() de Auth.js se encargará de:
        // 1. Borrar cookies (usando sus nombres internos correctos)
        // 2. Limpiar el estado de sesión de la librería
        // 3. Redirigirnos finalmente al login
        signOut({ 
            callbackUrl: "/login", 
            redirect: true 
        });
    });
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
    <h1 class="text-xl font-medium text-gray-600">Signing out...</h1>
    <p class="text-sm text-gray-400">Clearing local credentials</p>
</div>