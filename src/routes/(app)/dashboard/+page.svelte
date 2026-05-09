<script lang="ts">
    let { data } = $props();
    
    // Simulación de datos que vendrían de Postgres vía Supabase
    let search = $state('');
    let transactions = $state([
        { id: 1, shop: 'Ferretería Central', date: '2023-10-25', amount: 45.00, status: 'Completado' },
        { id: 2, shop: 'Ferretería Central', date: '2023-10-24', amount: 120.50, status: 'Completado' },
        { id: 3, shop: 'Portal Pagos (Fee)', date: '2023-10-20', amount: 2.00, status: 'Completado' },
    ]);

    // Rune $derived para filtrar transacciones en tiempo real
    let filteredTransactions = $derived(
        transactions.filter(t => t.shop.toLowerCase().includes(search.toLowerCase()))
    );
</script>

<div class="max-w-4xl mx-auto p-6">
    <div class="flex justify-between items-end mb-8">
        <div>
            <h1 class="text-3xl font-black text-gray-900">Mis Pagos Recientes</h1>
            <p class="text-gray-500">Gestiona tus transacciones centralizadas</p>
        </div>
        <input 
            bind:value={search}
            type="text" 
            placeholder="Buscar comercio..." 
            class="p-2 border-b-2 border-gray-200 outline-none focus:border-indigo-500 transition-colors"
        />
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full text-left">
            <thead class="bg-gray-50 border-b border-gray-100">
                <tr>
                    <th class="p-4 font-semibold text-gray-600">Comercio</th>
                    <th class="p-4 font-semibold text-gray-600">Fecha</th>
                    <th class="p-4 font-semibold text-gray-600">Monto</th>
                    <th class="p-4 font-semibold text-gray-600">Estado</th>
                </tr>
            </thead>
            <tbody>
                {#each filteredTransactions as item}
                    <tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td class="p-4 font-medium">{item.shop}</td>
                        <td class="p-4 text-gray-500">{item.date}</td>
                        <td class="p-4 font-bold text-gray-900">${item.amount.toFixed(2)}</td>
                        <td class="p-4">
                            <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                {item.status}
                            </span>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>