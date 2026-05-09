<script lang="ts">
	import { CreditCard, Lock, CheckCircle } from 'lucide-svelte';
	let { data } = $props();

	// Estados usando Runas
	let processing = $state(false);
	let completed = $state(false);
	let cardData = $state({
		number: '',
		expiry: '',
		cvc: '',
		name: ''
	});

	// Derivado: Validar si el botón de pago debe estar activo
	let isValid = $derived(
		cardData.number.length >= 16 && cardData.cvc.length >= 3 && cardData.name.length > 3
	);

	async function handlePayment() {
		processing = true;

		// Llamamos a una API interna para guardar en Supabase
		const response = await fetch('/api/save-payment', {
			method: 'POST',
			body: JSON.stringify({
				amount: data.paymentData.amount,
				description: data.paymentData.orderId,
				user_id: data.session?.user?.id || 'anonymous'
			})
		});

		if (response.ok) {
			processing = false;
			completed = true;
		}
	}
</script>

<div class="mx-auto my-10 max-w-xl rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
	{#if !completed}
		<header class="mb-8">
			<h1 class="text-2xl font-bold text-gray-800">Finalizar Pago</h1>
			<p class="text-gray-500">Orden: {data.paymentData.orderId}</p>
			<div class="mt-4 flex items-center justify-between rounded-lg bg-indigo-50 p-4">
				<span class="font-medium text-indigo-900">Total a pagar:</span>
				<span class="text-2xl font-black text-indigo-600">${data.paymentData.amount}</span>
			</div>
		</header>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				handlePayment();
			}}
			class="space-y-4"
		>
			<div>
				<label class="block text-sm font-semibold text-gray-600">Nombre en Tarjeta</label>
				<input
					bind:value={cardData.name}
					type="text"
					class="mt-1 w-full rounded-lg border p-3 transition-all outline-none focus:ring-2 focus:ring-indigo-500"
					placeholder="Nombre completo"
					required
				/>
			</div>

			<div>
				<label class="block text-sm font-semibold text-gray-600">Número de Tarjeta</label>
				<div class="relative">
					<input
						bind:value={cardData.number}
						type="text"
						maxlength="16"
						class="mt-1 w-full rounded-lg border p-3 pl-12 transition-all outline-none focus:ring-2 focus:ring-indigo-500"
						placeholder="0000 0000 0000 0000"
						required
					/>
					<CreditCard class="absolute top-4 left-4 size-5 text-gray-400" />
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<input
					bind:value={cardData.expiry}
					type="text"
					placeholder="MM/YY"
					class="rounded-lg border p-3 outline-none focus:ring-2 focus:ring-indigo-500"
					required
				/>
				<input
					bind:value={cardData.cvc}
					type="password"
					maxlength="3"
					placeholder="CVC"
					class="rounded-lg border p-3 outline-none focus:ring-2 focus:ring-indigo-500"
					required
				/>
			</div>

			<button
				type="submit"
				disabled={!isValid || processing}
				class="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 font-bold text-white shadow-lg transition-all hover:bg-indigo-700 disabled:bg-gray-300"
			>
				{#if processing}
					<div class="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
					Procesando...
				{:else}
					<Lock size={18} /> Pagar Ahora
				{/if}
			</button>
		</form>
	{:else}
		<div class="animate-in fade-in zoom-in py-10 text-center duration-500">
			<CheckCircle class="mx-auto mb-4 size-20 text-green-500" />
			<h2 class="text-3xl font-bold text-gray-800">¡Pago Confirmado!</h2>
			<p class="mt-2 text-gray-500">El recibo ha sido enviado a tu correo.</p>
			<a
				href="/dashboard"
				class="mt-8 inline-block rounded-full bg-gray-900 px-8 py-3 text-white transition-colors hover:bg-gray-800"
			>
				Ir a mis movimientos
			</a>
		</div>
	{/if}
</div>
