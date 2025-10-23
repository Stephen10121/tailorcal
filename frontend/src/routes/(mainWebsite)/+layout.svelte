<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	import { Toaster } from "$lib/components/ui/sonner/index.js";

	let { children } = $props();
</script>

<Toaster />
<ModeWatcher />
<main class="min-h-screen">
	{@render children?.()}
</main>
