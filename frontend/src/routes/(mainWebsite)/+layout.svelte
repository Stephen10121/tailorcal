<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import '../../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster />
<ModeWatcher />
<main class="min-h-screen">
	{@render children?.()}
</main>
