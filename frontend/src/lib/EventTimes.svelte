<script lang="ts">
    import { MONTHTOSTRING, type EventTimesType } from "./utils";
    import Time from "./Time.svelte";

    let { time, useAMPM, multiDayEvent, today }: { time: EventTimesType, useAMPM: boolean, multiDayEvent: boolean, today: Date } = $props();

    let start = $derived(new Date(time.startTime));
    let end = $derived(new Date(time.endTime));
</script>

{time.name}: {#if multiDayEvent && start.getDate() !== today.getDate()}{MONTHTOSTRING[start.getMonth()]} {start.getDate()}, {/if} <Time date={start} {useAMPM} /> - {#if multiDayEvent && end.getDate() !== today.getDate()}{MONTHTOSTRING[end.getMonth()]} {end.getDate()}, {/if} <Time date={end} {useAMPM} />
