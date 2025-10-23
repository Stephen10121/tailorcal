<script lang="ts">
    import DashboardHeader from '@/dashboard/DashboardHeader.svelte';
    import DashboardSidebar from '@/dashboard/DashboardSidebar.svelte';
    import SetEmailPopup from '@/dashboard/SetEmailPopup.svelte';
    import { emailNotSetDialog } from '@/store.js';

	let { children, data } = $props();

	emailNotSetDialog.set(!data.user.userEmail);
</script>

<SetEmailPopup />

<div class="flex min-h-screen bg-background">
	<DashboardSidebar pathname={data.pathname} />

	<div class="flex-1 flex flex-col">
		<DashboardHeader avatar={data.avatar} user={data.user} />

		<main class="flex-1 p-6 space-y-6">
			{@render children?.()}
		</main>
	</div>
</div>
