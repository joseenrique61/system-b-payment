<script lang="ts">
    import { User, CreditCard, Save, CheckCircle } from 'lucide-svelte';

    // Estado inicial (En un caso real, vendría de data.profile desde Supabase)
    let profile = $state({
        fullName: "Usuario Demo",
        email: "usuario@ejemplo.com",
        address: "Av. Principal 123",
        city: "Quito",
        taxId: "1700000000001",
        preferredMethod: "Visa **** 4422"
    });

    let isSaving = $state(false);
    let showSuccess = $state(false);

    // Runas: Estado original para comparar cambios
    const originalProfile = { ...profile };
    let hasChanges = $derived(JSON.stringify(profile) !== JSON.stringify(originalProfile));

    async function saveSettings() {
        isSaving = true;
        // Simulación de guardado en Supabase Postgres
        await new Promise(r => setTimeout(r, 1500));
        isSaving = false;
        showSuccess = true;
        setTimeout(() => showSuccess = false, 3000);
    }
</script>

<div class="max-w-4xl mx-auto p-6">
    <header class="mb-8">
        <h1 class="text-3xl font-black text-gray-900">Configuración</h1>
        <p class="text-gray-500">Gestiona tu identidad y datos de facturación centralizados.</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Sidebar de navegación interna -->
        <aside class="space-y-2">
            <button class="w-full flex items-center gap-3 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-bold">
                <User size={18} /> Perfil Personal
            </button>
            <button class="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <CreditCard size={18} /> Métodos de Pago
            </button>
        </aside>

        <!-- Formulario Principal -->
        <main class="md:col-span-2 space-y-6">
            <section class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h2 class="text-lg font-bold mb-4 border-b pb-2">Datos de Facturación</h2>
                
                <div class="grid grid-cols-1 gap-4">
                    <div>
                        <label class="text-xs font-bold text-gray-400 uppercase">Nombre Completo</label>
                        <input bind:value={profile.fullName} type="text" class="w-full mt-1 p-2 bg-gray-50 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-xs font-bold text-gray-400 uppercase">RUC / ID Fiscal</label>
                            <input bind:value={profile.taxId} type="text" class="w-full mt-1 p-2 bg-gray-50 border rounded-md" />
                        </div>
                        <div>
                            <label class="text-xs font-bold text-gray-400 uppercase">Ciudad</label>
                            <input bind:value={profile.city} type="text" class="w-full mt-1 p-2 bg-gray-50 border rounded-md" />
                        </div>
                    </div>

                    <div>
                        <label class="text-xs font-bold text-gray-400 uppercase">Dirección de Envío</label>
                        <textarea bind:value={profile.address} class="w-full mt-1 p-2 bg-gray-50 border rounded-md"></textarea>
                    </div>
                </div>
            </section>

            <!-- Botón de Acción -->
            <div class="flex items-center justify-end gap-4">
                {#if showSuccess}
                    <span class="text-green-600 flex items-center gap-1 animate-bounce">
                        <CheckCircle size={18} /> Guardado correctamente
                    </span>
                {/if}

                <button 
                    onclick={saveSettings}
                    disabled={!hasChanges || isSaving}
                    class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                    {#if isSaving}
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {:else}
                        <Save size={18} /> Guardar Cambios
                    {/if}
                </button>
            </div>
        </main>
    </div>
</div>