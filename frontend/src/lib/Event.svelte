<script lang="ts">
    import { CalendarPlus, ClipboardClock, Clock, MapPin } from "@lucide/svelte";
    import { MONTHTOSTRING, type EventDBModel } from "./utils";
    import EventResources from "./EventResources.svelte";
    import Time from "./Time.svelte";
    import EventTimes from "./EventTimes.svelte";

    let { event, currentDay, useAMPM }: { event: EventDBModel, currentDay: Date, useAMPM: boolean } = $props();

    const start = $derived(new Date(event.startTime));
    const end = $derived(new Date(event.endTime));

    const hours = $derived((end.getTime() - start.getTime()) / (1000 * 60 * 60));

    const EVENT_DAY_NUMBER = $derived(currentDay.getDate() - start.getDate() + 1);
    const MULTI_DAY_EVENT = $derived(hours >= 24);

    function getContrastYIQ(hexColor: string) {
        // Remove '#' if present
        hexColor = hexColor.replace(/^#/, '');

        // Parse r, g, b values
        const r = parseInt(hexColor.substr(0, 2), 16);
        const g = parseInt(hexColor.substr(2, 2), 16);
        const b = parseInt(hexColor.substr(4, 2), 16);

        // YIQ formula
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;

        // Return black or white text
        return yiq >= 128 ? '#000000' : '#FFFFFF';
    }
</script>

<div class="dark rounded-lg bg-foreground p-4" style="border: 1px solid #333333">
    <div class="dark mb-3 flex items-start justify-between">
        <h3 class="dark text-lg font-semibold text-white">{event.name}</h3>
        <p class="dark text-sm text-gray-400">{#if EVENT_DAY_NUMBER !== 1}{MONTHTOSTRING[start.getMonth()]} {start.getDate()}, {/if} <Time date={start} {useAMPM} /></p>
    </div>

    <div class="mb-2 flex items-center gap-2 text-sm text-gray-400">
        <Clock class="h-4 w-4" />
        {#if MULTI_DAY_EVENT}
            <span class="text-sm text-gray-300">{MONTHTOSTRING[start.getMonth()]} {start.getDate()}, <Time date={start} {useAMPM} /> - {MONTHTOSTRING[end.getMonth()]} {end.getDate()}, <Time date={end} {useAMPM} /></span>
        {:else}
            <span class="text-sm text-gray-300"><Time date={start} {useAMPM} /> - <Time date={end} {useAMPM} /></span>
        {/if}
    </div>

    {#if MULTI_DAY_EVENT}
        <div class="mb-2 flex items-center gap-2 text-sm text-gray-400">
            <CalendarPlus class="h-4 w-4" />
            <span class="text-gray-300">Multi-day event - Day {EVENT_DAY_NUMBER}</span>
        </div>
    {/if}

    {#if event.location}
        <div class="mb-2 flex items-center gap-2 text-sm text-gray-400">
            <MapPin class="h-4 w-4" />
            <span class="text-gray-300">{event.location}</span>
        </div>
    {/if}

    <EventResources resources={event.resources} />

    {#if event.times && event.times.length > 1}
        <div class="mb-3 flex items-start gap-2 text-sm text-gray-400">
            <ClipboardClock class="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
                <div class="text-gray-400">Time Schedule:</div>
                <div class="text-gray-300">
                    {#each event.times as time, index (`anEventTime${time.name}${event.id}`)}
                        <EventTimes today={currentDay} {useAMPM} {time} multiDayEvent={MULTI_DAY_EVENT} />{#if index+1 < event.times.length},<br>{/if}
                    {/each}
                </div>
            </div>
        </div>
    {/if}

    {#if event.tags}
        <div class="flex flex-wrap gap-2">
            {#each event.tags as tag (`taglist${tag.id}${event.id}`)}
                <div style="background-color: #ffffff;" class="rounded">
                    <span class="rounded px-2 py-1 text-xs font-medium" style="background-color: {tag.color}cc;border: 1px solid {tag.color};color: {getContrastYIQ(tag.color)};">
                        {tag.name}
                    </span>
                </div>
            {/each}
        </div>
    {/if}
</div>