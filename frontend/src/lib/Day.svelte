<script lang="ts">
    import Event from "./Event.svelte";
    import { dateRangeOverlaps, DAYTOSTRING, LONGDAYTOSTRING, type EventDBModel } from "./utils";

    let { events, day, useAMPM, dayNumber }: { events: EventDBModel[], day: Date, dayNumber: number, useAMPM: boolean } = $props();

    let nextDay = $derived(new Date(day.getTime() + (24 * 60 * 60 * 999) * 1));
</script>

<div class="flex flex-col gap-4">
    <div class="flex flex-col gap-1">
        <div class="text-sm font-medium text-muted-foreground">
            {#if dayNumber === 1}
                Today
            {:else if dayNumber === 2}
                Tomorrow
            {:else if dayNumber === 3}
                Day after Tomorrow
            {/if}
        </div>
        <div class="text-xl font-semibold text-accent">{LONGDAYTOSTRING[day.getDay()]}, {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][day.getMonth()]} {day.getDate()}</div>
    </div>

    <div class="flex flex-col gap-4">
        {#each events as event (`eventListDat${day.toString()}${event.id}`)}
            {#if dateRangeOverlaps(day, nextDay, new Date(event.startTime), new Date(event.endTime))}
                <Event {event} currentDay={day} {useAMPM} />
            {/if}
        {/each}
    </div>
</div>