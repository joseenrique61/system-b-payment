<script lang="ts">
    import { signOut } from "@auth/sveltekit/client";
    import { CreditCard, LogOut, User } from "lucide-svelte";
    import { page } from '$app/state';

    // Svelte 5: Recibimos la sesión desde el layout
    let { session } = $props();

    // Derivado para saber en qué página estamos
    let activePath = $derived(page.url.pathname);
</script>

<nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex items-center">
                <a href="/dashboard" class="flex items-center gap-2 text-indigo-600 font-black text-xl">
                    <CreditCard class="size-8" />
                    <span class="hidden md:block tracking-tight text-gray-900">PAY-PORTAL</span>
                </a>
                
                {#if session?.user}
                <div class="hidden sm:ml-10 sm:flex sm:space-x-8">
                    <a href="/dashboard" class="inline-flex items-center px-1 pt-1 text-sm font-medium {activePath === '/dashboard' ? 'border-b-2 border-indigo-500 text-gray-900' : 'text-gray-500 hover:text-gray-700'}">
                        Dashboard
                    </a>
                    <a href="/settings" class="inline-flex items-center px-1 pt-1 text-sm font-medium {activePath === '/settings' ? 'border-b-2 border-indigo-500 text-gray-900' : 'text-gray-500 hover:text-gray-700'}">
                        Configuración
                    </a>
                </div>
                {/if}
            </div>

            <div class="flex items-center gap-4">
                {#if session?.user}
                    <div class="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        <div class="text-right hidden md:block">
                            <p class="text-xs font-bold text-gray-900 leading-none">{session.user.name}</p>
                            <p class="text-[10px] text-gray-500 leading-none mt-1">SSO Autenticado</p>
                        </div>
                        <div class="bg-indigo-100 p-1.5 rounded-full">
                            <User size={16} class="text-indigo-600" />
                        </div>
                    </div>
                    
                    <button 
                        onclick={() => signOut()}
                        class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Cerrar Sesión"
                    >
                        <LogOut size={20} />
                    </button>
                {:else}
                    <a href="/login" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Entrar</a>
                {/if}
            </div>
        </div>
    </div>
</nav>