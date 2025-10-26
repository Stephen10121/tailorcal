<script lang="ts">
    import { navigating } from '$app/state';
    import DashboardHeader from '@/dashboard/DashboardHeader.svelte';
    import DashboardIsNavigating from '@/dashboard/DashboardIsNavigating.svelte';
    import DashboardSidebar from '@/dashboard/DashboardSidebar.svelte';
    import SetEmailPopup from '@/dashboard/SetEmailPopup.svelte';
    import { emailNotSetDialog } from '@/store.js';

	let { children, data } = $props();

	emailNotSetDialog.set(!data.user.userEmail);
</script>

<SetEmailPopup />

<div class="flex min-h-screen bg-background">
	<DashboardSidebar pathname={data.pathname} />

	<div class="flex-1 flex flex-col h-full">
		<DashboardHeader avatar={data.avatar} user={data.user} calendars={data.calendars} />

		<main class="flex-1 p-6 space-y-6 mainPage relative h-full">
			{#if navigating.complete !== null}
				<DashboardIsNavigating />
			{/if}
			{@render children?.()}
		</main>
	</div>
</div>

<style>
	.mainPage {
		max-height: calc(100vh - 64px);
		overflow-y: auto;
	}
</style>