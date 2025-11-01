<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { onMount } from "svelte";
    import Day from "./Day.svelte";
    import type { CalendarCustomizations, EventDBModel } from "./utils";
    import { Temporal } from 'temporal-polyfill';

    let { events, displaySettings, timeZone }: { events: EventDBModel[], displaySettings: CalendarCustomizations, timeZone: Temporal.TimeZoneLike } = $props();

    let calendarCustomizations: CalendarCustomizations = $derived(displaySettings);

    let today = $state(Temporal.Now.zonedDateTimeISO().startOfDay());
    let tomorrow = $state(Temporal.Now.zonedDateTimeISO().add({ days: 1 }).startOfDay());
    let thirdDay = $state(Temporal.Now.zonedDateTimeISO().add({ days: 2 }).startOfDay());

    function updatePage() {
        console.log("Updating Page.");
        today = Temporal.Now.zonedDateTimeISO().startOfDay();
        tomorrow = Temporal.Now.zonedDateTimeISO().add({ days: 1 }).startOfDay();
        thirdDay = Temporal.Now.zonedDateTimeISO().add({ days: 2 }).startOfDay();

        invalidateAll();
    }

    onMount(() => {
        const updater = setInterval(updatePage, 20000);
        return () => {
            clearInterval(updater);
        }
    });
</script>

<div class="dark mx-auto">
    <div class="dark grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Day dayNumber={1} events={events} {timeZone} {calendarCustomizations}  day={today} />
        <Day dayNumber={2} events={events} {timeZone} {calendarCustomizations}  day={tomorrow} />
        <Day dayNumber={3} events={events} {timeZone} {calendarCustomizations}  day={thirdDay} />
    </div>
</div>