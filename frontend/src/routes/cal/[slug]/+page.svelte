<script lang="ts">
    import Calendar from '@/Calendar.svelte';

    let { data } = $props();
</script>

<svelte:head>
    <title>{data.name}</title>
    <link rel="shortcut icon" href={data.logoLink} type="image/x-icon">
</svelte:head>

<div class="min-h-screen p-6">
    <Calendar events={data.events} />
</div>