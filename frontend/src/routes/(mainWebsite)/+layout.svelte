<script lang="ts">
	import { Toaster } from "$lib/components/ui/sonner/index.js";

	let { children } = $props();
</script>

<Toaster />
<main class="min-h-screen">
	{@render children?.()}
</main>
