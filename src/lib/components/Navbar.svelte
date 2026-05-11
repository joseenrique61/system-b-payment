<script lang="ts">
	import { CreditCard, LogOut, User } from 'lucide-svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	// Svelte 5: Recibimos la sesión desde el layout
	let { session } = $props();

	// Derivado para saber en qué página estamos
	let activePath = $derived(page.url.pathname);
</script>

<nav class="sticky top-0 z-50 border-b border-gray-100 bg-white">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 justify-between">
			<div class="flex items-center">
				<a
					href={resolve('/dashboard')}
					class="flex items-center gap-2 text-xl font-black text-indigo-600"
				>
					<CreditCard class="size-8" />
					<span class="hidden tracking-tight text-gray-900 md:block">PAY-PORTAL</span>
				</a>

				{#if session?.user}
					<div class="hidden sm:ml-10 sm:flex sm:space-x-8">
						<a
							href={resolve('/dashboard')}
							class="inline-flex items-center px-1 pt-1 text-sm font-medium {activePath ===
							'/dashboard'
								? 'border-b-2 border-indigo-500 text-gray-900'
								: 'text-gray-500 hover:text-gray-700'}"
						>
							Dashboard
						</a>
						<a
							href={resolve('/settings')}
							class="inline-flex items-center px-1 pt-1 text-sm font-medium {activePath ===
							'/settings'
								? 'border-b-2 border-indigo-500 text-gray-900'
								: 'text-gray-500 hover:text-gray-700'}"
						>
							Configuración
						</a>
					</div>
				{/if}
			</div>

			<div class="flex items-center gap-4">
				{#if session?.user}
					<div
						class="flex items-center gap-3 rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5"
					>
						<div class="hidden text-right md:block">
							<p class="text-xs leading-none font-bold text-gray-900">{session.user.name}</p>
							<p class="mt-1 text-[10px] leading-none text-gray-500">SSO Autenticado</p>
						</div>
						<div class="rounded-full bg-indigo-100 p-1.5">
							<User size={16} class="text-indigo-600" />
						</div>
					</div>

					<a
						class="p-2 text-gray-400 transition-colors hover:text-red-600"
						title="Cerrar Sesión"
						href={resolve('/logout')}
					>
						<LogOut size={20} />
					</a>
				{:else}
					<a
						href={resolve('/login')}
						class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white">Entrar</a
					>
				{/if}
			</div>
		</div>
	</div>
</nav>
