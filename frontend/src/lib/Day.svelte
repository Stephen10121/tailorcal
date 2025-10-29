<script lang="ts">
    import Event from "./Event.svelte";
    import { dateRangeOverlaps, LONGDAYTOSTRING, type CalendarCustomizations, type EventDBModel } from "./utils";

    let { events, day, dayNumber, calendarCustomizations }: { events: EventDBModel[], day: Date, dayNumber: number, calendarCustomizations: CalendarCustomizations } = $props();

    let nextDay = $derived(new Date(day.getTime() + (24 * 60 * 60 * 999) * 1));
</script>

<div class="dark flex flex-col gap-4">
    <div class="dark flex flex-col gap-1">
        <div class="dark text-sm font-medium text-muted-foreground">
            {#if dayNumber === 1}
                Today
            {:else if dayNumber === 2}
                Tomorrow
            {:else if dayNumber === 3}
                Day after Tomorrow
            {/if}
        </div>
        <div class="dark text-xl font-semibold text-accent">{LONGDAYTOSTRING[day.getDay()]}, {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][day.getMonth()]} {day.getDate()}</div>
    </div>

    <div class="dark flex flex-col gap-4">
        {#each events as event (`eventListDat${day.toString()}${event.id}`)}
            {#if dateRangeOverlaps(day, nextDay, new Date(event.startTime), new Date(event.endTime))}
                <Event {calendarCustomizations} {event} currentDay={day} />
            {/if}
        {/each}
    </div>
</div>