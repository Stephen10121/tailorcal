<script lang="ts">
    import Time from "./Time.svelte";

    let { date }: { date: Date } = $props();
</script>

{["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()]} {date.getDate()} {date.getFullYear()} <Time {date} useAMPM />