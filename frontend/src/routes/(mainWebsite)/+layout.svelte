<script lang="ts">
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster />
<main class="min-h-screen">
	{@render children?.()}
</main>
