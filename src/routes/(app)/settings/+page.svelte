<script lang="ts">
	import { enhance } from '$app/forms';

	import { User, CreditCard, Save, CheckCircle, Plus, Trash2, AlertCircle } from 'lucide-svelte';

	let { data, form } = $props();

	let isSaving = $state(false);
	let showSuccess = $state(false);
	let showAddCard = $state(false);
	let showMessage = $state(false);

	// Runas: Estado original para comparar cambios
	let profile = $state({ ...data.profile });
	const originalProfile = { ...profile };
	let hasChanges = $derived(JSON.stringify(profile) !== JSON.stringify(originalProfile));
</script>

<div class="mx-auto max-w-4xl p-6">
	<header class="mb-8">
		<h1 class="text-3xl font-black text-gray-900">Configuración</h1>
		<p class="text-gray-500">Gestiona tu identidad y datos de facturación centralizados.</p>
	</header>

	<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
		<!-- Sidebar de navegación interna -->
		<!-- <aside class="space-y-2">
			<button
				class="flex w-full items-center gap-3 rounded-lg bg-indigo-50 px-4 py-2 font-bold text-indigo-700"
			>
				<User size={18} /> Perfil Personal
			</button>
			<button
				class="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100"
			>
				<CreditCard size={18} /> Métodos de Pago
			</button>
		</aside> -->

		<!-- Formulario Principal -->
		<main class="space-y-6 md:col-span-2">
			<!-- <section class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
				<h2 class="mb-4 border-b pb-2 text-lg font-bold">Datos de Facturación</h2>

				<div class="grid grid-cols-1 gap-4">
					<div>
						<label class="text-xs font-bold text-gray-400 uppercase">Nombre Completo</label>
						<input
							bind:value={profile.fullName}
							type="text"
							class="mt-1 w-full rounded-md border bg-gray-50 p-2 outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="text-xs font-bold text-gray-400 uppercase">RUC / ID Fiscal</label>
							<input
								bind:value={profile.taxId}
								type="text"
								class="mt-1 w-full rounded-md border bg-gray-50 p-2"
							/>
						</div>
						<div>
							<label class="text-xs font-bold text-gray-400 uppercase">Ciudad</label>
							<input
								bind:value={profile.city}
								type="text"
								class="mt-1 w-full rounded-md border bg-gray-50 p-2"
							/>
						</div>
					</div>

					<div>
						<label class="text-xs font-bold text-gray-400 uppercase">Dirección de Envío</label>
						<textarea
							bind:value={profile.address}
							class="mt-1 w-full rounded-md border bg-gray-50 p-2"
						></textarea>
					</div>
				</div>
			</section> -->

			<!-- Formulario de Perfil Personal -->
			<form
				method="POST"
				action="?/updateProfile"
				use:enhance={() => {
					isSaving = true;
					return async ({ update }) => {
						await update();
						isSaving = false;
						showMessage = true;
						setTimeout(() => (showMessage = false), 3000);
					};
				}}
				class="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
			>
				<h2 class="mb-6 flex items-center gap-2 text-xl font-bold">
					<div class="size-2 rounded-full bg-indigo-600"></div>
					Datos de Facturación
				</h2>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div class="md:col-span-2">
						<label class="block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>Nombre Completo</label
						>
						<input
							name="fullName"
							bind:value={profile.full_name}
							type="text"
							class="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 transition-all outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>

					<div>
						<label class="block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>RUC / Cédula / Tax ID</label
						>
						<input
							name="taxId"
							bind:value={profile.tax_id}
							type="text"
							class="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 p-3"
						/>
					</div>

					<div>
						<label class="block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>Ciudad</label
						>
						<input
							name="city"
							bind:value={profile.city}
							type="text"
							class="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 p-3"
						/>
					</div>

					<div class="md:col-span-2">
						<label class="block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>Dirección de Domicilio</label
						>
						<textarea
							name="address"
							bind:value={profile.address}
							rows="3"
							class="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 p-3"
						></textarea>
					</div>
				</div>

				<div class="mt-8 flex items-center justify-between border-t pt-6">
					<div class="flex items-center gap-2">
						{#if form?.message}
							<span class="flex items-center gap-1 font-medium text-red-600">
								<AlertCircle size={18} /> Error al guardar: {form!.message}
							</span>
						{:else if showMessage}
							<span
								class="animate-in fade-in slide-in-from-left-2 flex items-center gap-1 font-medium text-green-600"
							>
								<CheckCircle size={18} /> ¡Cambios guardados en Postgres!
							</span>
						{/if}
					</div>

					<button
						type="submit"
						disabled={!hasChanges || isSaving}
						class="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 disabled:bg-gray-200"
					>
						{#if isSaving}
							<div class="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
							Guardando...
						{:else}
							<Save size={18} /> Actualizar Perfil
						{/if}
					</button>
				</div>
			</form>

			<section class="mt-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
				<div class="mb-6 flex items-center justify-between">
					<h2 class="text-lg font-bold">Métodos de Pago Guardados</h2>
					<button
						onclick={() => (showAddCard = !showAddCard)}
						class="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white"
					>
						<Plus size={16} />
						{showAddCard ? 'Cancelar' : 'Agregar Tarjeta'}
					</button>
				</div>

				{#if showAddCard}
					<form
						method="POST"
						action="?/addCard"
						use:enhance={() => {
							return async ({ update }) => {
								showAddCard = false;
								update();
							};
						}}
						class="mb-8 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4"
					>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<input
								name="holderName"
								placeholder="Nombre en la tarjeta"
								class="rounded-md border p-2"
								required
							/>
							<input
								name="cardNumber"
								placeholder="Número de tarjeta"
								maxlength="16"
								class="rounded-md border p-2"
								required
							/>
							<button
								type="submit"
								class="rounded-md bg-gray-900 py-2 font-bold text-white md:col-span-2"
							>
								Guardar Tarjeta
							</button>
						</div>
					</form>
				{/if}

				<div class="space-y-3">
					{#each data.methods as method}
						<div
							class="flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-gray-50"
						>
							<div class="flex items-center gap-4">
								<div class="rounded-lg bg-gray-100 p-2">
									<CreditCard class="text-gray-600" />
								</div>
								<div>
									<p class="font-bold text-gray-900">{method.provider} **** {method.last_four}</p>
									<p class="text-xs text-gray-500 uppercase">{method.holder_name}</p>
								</div>
							</div>
							<button class="text-gray-400 hover:text-red-600">
								<Trash2 size={18} />
							</button>
						</div>
					{:else}
						<p class="text-center text-gray-400 py-4">No tienes tarjetas registradas.</p>
					{/each}
				</div>
			</section>

			<!-- Botón de Acción -->
			<!-- <div class="flex items-center justify-end gap-4">
				{#if showSuccess}
					<span class="flex animate-bounce items-center gap-1 text-green-600">
						<CheckCircle size={18} /> Guardado correctamente
					</span>
				{/if}

				<button
					onclick={saveSettings}
					disabled={!hasChanges || isSaving}
					class="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:bg-indigo-700 disabled:bg-gray-300"
				>
					{#if isSaving}
						<div class="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
					{:else}
						<Save size={18} /> Guardar Cambios
					{/if}
				</button>
			</div> -->
		</main>
	</div>
</div>
