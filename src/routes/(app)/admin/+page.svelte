<script lang="ts">
    import { BarChart3, Users, DollarSign, Search, ShieldCheck } from 'lucide-svelte';
    
    let { data } = $props();
    let searchTerm = $state('');

    // --- RUNAS: Lógica de Negocio ---
    
    // 1. Filtrar transacciones según el buscador
    let filteredPayments = $derived(
        data.allPayments.filter(p => 
            p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.user_id.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // 2. Calcular métricas globales usando $derived
    let totalRevenue = $derived(
        data.allPayments.reduce((acc, curr) => acc + Number(curr.amount), 0)
    );

    let totalTransactions = $derived(data.allPayments.length);
</script>

<div class="max-w-7xl mx-auto p-6 space-y-8">
    <!-- Header con indicador de privilegio -->
    <header class="flex justify-between items-center">
        <div>
            <h1 class="text-4xl font-black text-gray-900 tracking-tight">Panel de Control Admin</h1>
            <p class="text-gray-500 font-medium flex items-center gap-2">
                <ShieldCheck size={16} class="text-indigo-600" /> 
                Vista restringida: Gestión global de pagos y auditoría KMS
            </p>
        </div>
        <div class="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl">
            <span class="text-xs font-bold text-indigo-600 uppercase">Estado del Sistema</span>
            <p class="text-sm font-bold text-indigo-900">Vault KMS: Operativo</p>
        </div>
    </header>

    <!-- Tarjetas de Métricas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div class="flex justify-between items-start mb-4">
                <div class="p-3 bg-green-50 rounded-xl text-green-600"><DollarSign /></div>
                <span class="text-xs font-bold text-gray-400">TOTAL RECAUDADO</span>
            </div>
            <p class="text-3xl font-black text-gray-900">${totalRevenue.toLocaleString()}</p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div class="flex justify-between items-start mb-4">
                <div class="p-3 bg-indigo-50 rounded-xl text-indigo-600"><BarChart3 /></div>
                <span class="text-xs font-bold text-gray-400">TRANSACCIONES</span>
            </div>
            <p class="text-3xl font-black text-gray-900">{totalTransactions}</p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div class="flex justify-between items-start mb-4">
                <div class="p-3 bg-purple-50 rounded-xl text-purple-600"><Users /></div>
                <span class="text-xs font-bold text-gray-400">USUARIOS FEDERADOS</span>
            </div>
            <p class="text-3xl font-black text-gray-900">Activos</p>
        </div>
    </div>

    <!-- Tabla de Auditoría -->
    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between gap-4">
            <h2 class="text-xl font-bold">Registro Global de Transacciones</h2>
            <div class="relative">
                <Search class="absolute left-3 top-2.5 text-gray-400 size-4" />
                <input 
                    bind:value={searchTerm}
                    placeholder="Buscar por ID de usuario o referencia..." 
                    class="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm w-full md:w-80 focus:ring-2 focus:ring-indigo-500"
                />
            </div>
        </div>

        <table class="w-full text-left">
            <thead class="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase">
                <tr>
                    <th class="p-4">ID Transacción (Postgres)</th>
                    <th class="p-4">Referencia / KMS Order</th>
                    <th class="p-4">Usuario (Keycloak ID)</th>
                    <th class="p-4">Fecha</th>
                    <th class="p-4">Monto</th>
                </tr>
            </thead>
            <tbody class="text-sm">
                {#each filteredPayments as p}
                    <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td class="p-4 font-mono text-[10px] text-gray-400">{p.id}</td>
                        <td class="p-4 font-bold text-gray-700">{p.description}</td>
                        <td class="p-4 text-gray-500 truncate max-w-[150px]">{p.user_id}</td>
                        <td class="p-4 text-gray-500">{new Date(p.created_at).toLocaleString()}</td>
                        <td class="p-4 font-black text-indigo-600">${p.amount}</td>
                    </tr>
                {:else}
                    <tr>
                        <td colspan="5" class="p-10 text-center text-gray-400 italic">No hay transacciones registradas en el sistema.</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>