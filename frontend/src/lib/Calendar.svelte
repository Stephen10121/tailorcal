<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { onMount } from "svelte";
    import Day from "./Day.svelte";
    import type { CalendarCustomizations, EventDBModel } from "./utils";

    let { events, displaySettings }: { events: EventDBModel[], displaySettings: CalendarCustomizations } = $props();

    let calendarCustomizations: CalendarCustomizations = $derived(displaySettings);

    let today = $state(new Date(new Date(new Date().getTime() + (24 * 60 * 60 * 1000) * 0).setHours(0, 0, 0, 0)));
    let tomorrow = $state(new Date(new Date(new Date().getTime() + (24 * 60 * 60 * 1000) * 1).setHours(0, 0, 0, 0)));
    let thirdDay = $state(new Date(new Date(new Date().getTime() + (24 * 60 * 60 * 1000) * 2).setHours(0, 0, 0, 0)));

    function updatePage() {
        console.log("Updating Page.");
        today = new Date(new Date(new Date().getTime() + (24 * 60 * 60 * 1000) * 0).setHours(0, 0, 0, 0));
        tomorrow = new Date(new Date(new Date().getTime() + (24 * 60 * 60 * 1000) * 1).setHours(0, 0, 0, 0));
        thirdDay = new Date(new Date(new Date().getTime() + (24 * 60 * 60 * 1000) * 2).setHours(0, 0, 0, 0));

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