<script lang="ts">
    import Calendar from '@/Calendar.svelte';

    let { data } = $props();
</script>

<svelte:head>
    <title>{data.name}</title>
    <link rel="shortcut icon" href={data.logoLink} type="image/x-icon">
</svelte:head>

<div class="dark min-h-screen w-full p-6 bg-background">
    <Calendar events={data.events} />
</div>