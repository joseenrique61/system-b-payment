<script>
	import './layout.css';
	import Navbar from '$lib/components/Navbar.svelte';
	let { data, children } = $props();
</script>

<svelte:head>
	<title>Pay-Portal</title>
</svelte:head>

<div class="min-h-screen bg-slate-50/50">
	<Navbar session={data.session} />
	<main>
		{@render children()}
	</main>
</div>
