<script lang="ts">
    import { signIn } from "@auth/sveltekit/client";
    import { Shield, ArrowRight } from "lucide-svelte";

    let isLoading = $state(false);

    function handleLogin() {
        isLoading = true;
        signIn("keycloak", { callbackUrl: "/" });
    }
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white p-4">
    <div class="max-w-md w-full text-center">
        <!-- Logo/Icono -->
        <div class="mb-8 flex justify-center">
            <div class="p-4 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200">
                <Shield class="size-12 text-white" />
            </div>
        </div>

        <h1 class="text-4xl font-black text-gray-900 mb-2">Portal de Pagos</h1>
        <p class="text-gray-500 mb-8">Acceso seguro centralizado para clientes y administradores.</p>

        <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <button 
                onclick={handleLogin}
                disabled={isLoading}
                class="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-all flex justify-center items-center gap-3 group"
            >
                {#if isLoading}
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {:else}
                    Iniciar sesión con Keycloak
                    <ArrowRight class="size-5 group-hover:translate-x-1 transition-transform" />
                {/if}
            </button>

            <div class="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400 uppercase tracking-widest font-bold">
                <span class="h-px w-8 bg-gray-200"></span>
                Seguridad de Grado Bancario
                <span class="h-px w-8 bg-gray-200"></span>
            </div>
        </div>

        <p class="mt-8 text-sm text-gray-400">
            Al continuar, accedes mediante el Sistema SSO centralizado.
            <br>Se requerirá Segundo Factor de Autenticación (MFA).
        </p>
    </div>
</div>