<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { onMount } from "svelte";
    import Day from "./Day.svelte";
    import type { CalendarCustomizations, EventDBModel } from "./utils";
    import { Temporal } from 'temporal-polyfill';

    let { events, displaySettings }: { events: EventDBModel[], displaySettings: CalendarCustomizations } = $props();

    let calendarCustomizations: CalendarCustomizations = $derived(displaySettings);

    let today = $state(new Date(Temporal.Now.zonedDateTimeISO().startOfDay().toInstant().epochMilliseconds));
    let tomorrow = $state(new Date(Temporal.Now.zonedDateTimeISO().add({ days: 1 }).startOfDay().toInstant().epochMilliseconds));
    let thirdDay = $state(new Date(Temporal.Now.zonedDateTimeISO().add({ days: 2 }).startOfDay().toInstant().epochMilliseconds));

    function updatePage() {
        console.log("Updating Page.");
        today = new Date(Temporal.Now.zonedDateTimeISO().startOfDay().toInstant().epochMilliseconds);
        tomorrow = new Date(Temporal.Now.zonedDateTimeISO().add({ days: 1 }).startOfDay().toInstant().epochMilliseconds);
        thirdDay = new Date(Temporal.Now.zonedDateTimeISO().add({ days: 2 }).startOfDay().toInstant().epochMilliseconds);

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
        <Day dayNumber={1} events={events} day={today} {calendarCustomizations} />
        <Day dayNumber={2} events={events} day={tomorrow} {calendarCustomizations} />
        <Day dayNumber={3} events={events} day={thirdDay} {calendarCustomizations} />
    </div>
</div>