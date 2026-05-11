<script lang="ts">
	import { resolve } from '$app/paths';
	import { CreditCard, ShieldCheck, User as UserIcon } from 'lucide-svelte';
	let { data } = $props();

	let processing = $state(false);
	let completed = $state(false);

	// Estado para el método seleccionado (por defecto la primera tarjeta guardada)
	let selectedMethodId = $state(data.methods[0]?.id || 'new');

	// Estado reactivo para el formulario, precargado con datos de Supabase
	let billingName = $state(data.profile.full_name || data.session?.user?.name || '');
	let billingAddress = $state(data.profile.address || '');

	let ciphertext = '';

	let countdown = $state(3);
	let startTimer = $state(false);
	$effect(() => {
		if (startTimer) {
			// timerStarted = true;
			const interval = setInterval(() => {
				if (countdown > 0) {
					countdown--;
				} else {
					clearInterval(interval);
					// Redirigir automáticamente al Sistema A
					redirectToBusiness();
				}
			}, 1000);

			// Limpieza del intervalo si el componente se destruye
			return () => clearInterval(interval);
		}
	});

	function redirectToBusiness() {
		window.location.href = `${data.paymentData.redirectUrl.substring(0, data.paymentData.redirectUrl.length - 1)}/PurchaseOrder/Buy?token=${ciphertext}`;
	}

	async function handlePayment() {
		processing = true;

		// Llamamos a una API interna para guardar en Supabase
		const response = await fetch('/api/save-payment', {
			method: 'POST',
			body: JSON.stringify({
				store: data.paymentData.store,
				date: new Date().toDateString(),
				amount: data.paymentData.amount,
				description: data.paymentData.orderId,
				user_id: data.session?.user?.id || 'anonymous'
			})
		});

		if (!response.ok) {
			console.error('An error occurred while saving the payment');
			return;
		}

		await new Promise((r) => setTimeout(r, 1000));

		// 2. Preparar payload de confirmación
		const confirmationPayload = {
			userId: data.paymentData.userId, // El ID que guardamos en la DB de SvelteKit
			status: 'PAID_SUCCESS'
		};

		// 3. ENCRIPTAR con Vault (Llamada al servidor de SvelteKit que usa el kmsService)
		const responseKms = await fetch('/api/encrypt-confirmation', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(confirmationPayload)
		});
		const { token } = await responseKms.json();
		ciphertext = token;

		processing = false;
		completed = true;
		startTimer = true;
	}
</script>

<div class="mx-auto my-10 max-w-4xl px-4">
	<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
		<!-- Columna Izquierda: Resumen de Compra -->
		<div class="space-y-6">
			<div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-xs font-bold tracking-widest text-gray-500 uppercase">
					Resumen del Pedido
				</h2>
				<div class="mb-2 flex items-center justify-between">
					<span class="text-gray-600">{data.paymentData.store}</span>
					<span class="font-bold">#{data.paymentData.orderId}</span>
				</div>
				<div class="mt-4 border-t pt-4">
					<div class="flex items-end justify-between">
						<span class="text-sm text-gray-500">Total a pagar:</span>
						<span class="text-3xl font-black text-indigo-600">${data.paymentData.amount}</span>
					</div>
				</div>
			</div>

			<div class="rounded-2xl bg-indigo-900 p-6 text-indigo-100 shadow-xl">
				<ShieldCheck class="mb-4 size-8 text-indigo-400" />
				<p class="text-sm font-medium">Pago Protegido</p>
				<p class="mt-1 text-xs opacity-70">
					Esta transacción está encriptada mediante un KMS de terceros y autenticada vía SSO.
				</p>
			</div>
		</div>

		<!-- Columna Derecha: Formulario de Pago -->
		<div class="md:col-span-2">
			{#if !completed}
				<div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
					<div class="p-8">
						<h1 class="mb-6 text-2xl font-bold text-gray-900">Información de Pago</h1>

						<!-- Selección de Tarjeta Guardada -->
						{#if data.methods.length > 0}
							<div class="mb-8">
								<label class="mb-3 block text-sm font-bold text-gray-400 uppercase"
									>Mis Tarjetas Guardadas</label
								>
								<div class="grid grid-cols-1 gap-3">
									{#each data.methods as method (method.id)}
										<button
											onclick={() => (selectedMethodId = method.id)}
											class="flex items-center justify-between rounded-xl border-2 p-4 transition-all {selectedMethodId ===
											method.id
												? 'border-indigo-600 bg-indigo-50'
												: 'border-gray-100 hover:border-gray-200'}"
										>
											<div class="flex items-center gap-4">
												<CreditCard
													class={selectedMethodId === method.id
														? 'text-indigo-600'
														: 'text-gray-400'}
												/>
												<div class="text-left">
													<p class="font-bold text-gray-900">
														{method.provider} **** {method.last_four}
													</p>
													<p class="text-xs text-gray-500 uppercase">{method.holder_name}</p>
												</div>
											</div>
											{#if selectedMethodId === method.id}
												<div
													class="flex size-5 items-center justify-center rounded-full bg-indigo-600"
												>
													<div class="size-2 rounded-full bg-white"></div>
												</div>
											{/if}
										</button>
									{/each}
									<button
										onclick={() => (selectedMethodId = 'new')}
										class="rounded-xl border-2 border-dashed p-4 text-sm font-medium text-gray-500 transition-all hover:bg-gray-50"
									>
										+ Usar otra tarjeta
									</button>
								</div>
							</div>
						{/if}

						<!-- Datos de Facturación (Precargados de Supabase) -->
						<div class="space-y-4">
							<h3 class="flex items-center gap-2 font-bold text-gray-900">
								<UserIcon size={18} class="text-gray-400" />
								Confirmar Datos de Facturación
							</h3>
							<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div class="space-y-1">
									<span class="text-xs font-bold text-gray-400 uppercase">Nombre</span>
									<input
										bind:value={billingName}
										class="w-full rounded-xl border border-gray-200 bg-gray-50 p-3"
									/>
								</div>
								<div class="space-y-1">
									<span class="text-xs font-bold text-gray-400 uppercase">Dirección</span>
									<input
										bind:value={billingAddress}
										class="w-full rounded-xl border border-gray-200 bg-gray-50 p-3"
									/>
								</div>
							</div>
						</div>

						<button
							onclick={handlePayment}
							disabled={processing}
							class="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 py-4 font-black text-white shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 disabled:bg-gray-300"
						>
							{#if processing}
								<div class="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
								PROCESANDO PAGO SEGURO...
							{:else}
								PAGAR ${data.paymentData.amount}
							{/if}
						</button>
					</div>
				</div>
			{:else}
				<!-- Estado de éxito (igual que antes) -->
				<div
					class="animate-in zoom-in rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm duration-300"
				>
					<div
						class="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-green-100 text-green-600"
					>
						<ShieldCheck size={40} />
					</div>
					<h2 class="text-3xl font-black text-gray-900">¡Transacción Exitosa!</h2>
					<p class="mt-2 text-gray-500">
						Los datos se han guardado en Postgres y el Sistema A ha sido notificado.
					</p>
					<button
						onclick={() => {
							redirectToBusiness();
						}}
						class="mt-8 inline-block rounded-full bg-gray-900 px-10 py-4 font-bold text-white"
						>Volver al Negocio ({countdown}s)</button
					>
					<a
						href={resolve('/dashboard')}
						class="mt-8 inline-block rounded-full bg-gray-900 px-10 py-4 font-bold text-white"
						>Volver al Portal</a
					>
				</div>
			{/if}
		</div>
	</div>
</div>
