<script lang="ts">
    import Autoplay from "embla-carousel-autoplay";
    import * as Carousel from "$lib/components/ui/carousel/index.js";
    import { SquareArrowOutUpRight } from "@lucide/svelte";
    import type { CarouselAPI } from "@/components/ui/carousel/context.js";
    import { AspectRatio } from "@/components/ui/aspect-ratio/index.js";
    import { Temporal } from "temporal-polyfill";
    import { mergeEventArrayAndCustomEventArray } from "@/utils";

    let { data } = $props();

    let displaySettings = $derived(data.displaySettings);

    let timeZone = $state(Temporal.Now.timeZoneId());
    let today = $state(Temporal.Now.zonedDateTimeISO(timeZone).startOfDay());
    let api = $state<CarouselAPI>();

    let allEvents = $derived(mergeEventArrayAndCustomEventArray(data.events, data.customEvents));

    function parentSentMessage(event: MessageEvent) {
        try {
            if (event.data.call === "displaySettings") {
                displaySettings = JSON.parse(event.data.value);
            }
        } catch(err) {
            console.log("Failed to recieve date from the parent container");
            console.log(err);
        }
    }

    $effect(() => {
        if (api && displaySettings) {
            api.reInit(undefined, [Autoplay({
                delay: displaySettings.feedDurationMS,
                playOnInit: true,
                stopOnFocusIn: false,
                stopOnInteraction: false,
                stopOnMouseEnter: false,
                stopOnLastSnap: false,
            })]);
        }
    });
</script>

<svelte:head>
    <title>{data.name}</title>
    <link rel="shortcut icon" href={data.logoLink} type="image/x-icon">
    <meta name="description" content={data.description}>
</svelte:head>

<svelte:window onmessage={parentSentMessage} />

{#if displaySettings.feedAnimationType === "slideshow"}
    <div class="h-screen w-screen">
        <Carousel.Root
            setApi={(emblaApi) => (api = emblaApi)}
            opts={{
                loop: true,
            }}
            plugins={[Autoplay({
                delay: data.displaySettings.feedDurationMS,
                playOnInit: true,
                stopOnFocusIn: false,
                stopOnInteraction: false,
                stopOnMouseEnter: false,
                stopOnLastSnap: false,
            })]}
            class="w-full h-full"
        >
            <Carousel.Content class="w-screen h-screen">
                {#each allEvents as event (`anEvent${event.data.id}`)}
                    {#if event.type === "event"}
                        {#if today.toInstant().epochMilliseconds < (new Date(event.data.startTime)).valueOf()}
                            <Carousel.Item class="w-screen h-screen">
                                <AspectRatio ratio={16 / 9} class="relative max-w-screen max-h-screen aspect-video centered-div">
                                    <img src={event.data.imageURL} alt={event.data.name} class="w-full h-full">
                                    {#if displaySettings.showEventExtraInfo && (displaySettings.showEventName || (displaySettings.showEventDescription && event.data.description.length > 0) || (displaySettings.showEventRegistration && event.data.registrationURL.length !== 0))}
                                        <div class="extrastuff overflow-hidden">
                                            <div class="info">
                                                {#if displaySettings.showEventName}
                                                    <h2 class="text-2xl">{event.data.name}</h2>
                                                {/if}

                                                {#if displaySettings.showEventDescription && event.data.description.length > 0}
                                                    <p class="text-sm">{event.data.description}</p>
                                                {/if}

                                                {#if displaySettings.showEventRegistration && event.data.registrationURL.length !== 0}
                                                    <a href={event.data.registrationURL} class="flex items-center gap-1" target="_blank">
                                                        Register Now
                                                        <SquareArrowOutUpRight class="h-4 w-4" />
                                                    </a>
                                                {/if}
                                            </div>
                                        </div>
                                    {/if}
                                </AspectRatio>
                            </Carousel.Item>
                        {/if}
                    {:else}
                        {#if today.toInstant().epochMilliseconds < (new Date(event.data.date)).valueOf()}
                            <Carousel.Item class="w-screen h-screen">
                                <AspectRatio ratio={16 / 9} class="relative max-w-screen max-h-screen aspect-video centered-div">
                                    <img src="{data.apiServer}api/files/{event.data.collectionId}/{event.data.id}/{event.data.picture}" alt={event.data.name} class="w-full h-full">
                                    {#if displaySettings.showEventExtraInfo && (displaySettings.showEventName || (displaySettings.showEventDescription && event.data.description.length > 0) || (displaySettings.showEventRegistration && event.data.registrationURL.length !== 0))}
                                        <div class="extrastuff overflow-hidden">
                                            <div class="info">
                                                {#if displaySettings.showEventName}
                                                    <h2 class="text-2xl">{event.data.name}</h2>
                                                {/if}

                                                {#if displaySettings.showEventDescription && event.data.description.length > 0}
                                                    <p class="text-sm">{event.data.description}</p>
                                                {/if}

                                                {#if displaySettings.showEventRegistration && event.data.registrationURL.length !== 0}
                                                    <a href={event.data.registrationURL} class="flex items-center gap-1" target="_blank">
                                                        Register Now
                                                        <SquareArrowOutUpRight class="h-4 w-4" />
                                                    </a>
                                                {/if}
                                            </div>
                                        </div>
                                    {/if}
                                </AspectRatio>
                            </Carousel.Item>
                        {/if}
                    {/if}
                {/each}
            </Carousel.Content>
        </Carousel.Root>
    </div>
{:else}
    <div class="flex flex-col gap-5 p-5 listView">
        {#each data.events as event, index (`anEventList${event.id}`)}
            {#if today.toInstant().epochMilliseconds < (new Date(event.startTime)).valueOf()}
                <div class="border listViewItem {index % 2 !== 0 ? "backwards" : ""} border-black">
                    <div class="img-container">
                        <img src={event.imageURL} alt={event.name} class="aspect-video w-full">
                    </div>
                    {#if displaySettings.showEventExtraInfo && (displaySettings.showEventName || (displaySettings.showEventDescription && event.description.length > 0) || (displaySettings.showEventRegistration && event.registrationURL.length !== 0))}
                        <div class="extra-info w-full h-full flex items-center justify-center flex-col">
                            {#if displaySettings.showEventName}
                                <h2 class="text-2xl">{event.name}</h2>
                            {/if}

                            {#if displaySettings.showEventDescription && event.description.length > 0}
                                <p class="text-sm">{event.description}</p>
                            {/if}

                            {#if displaySettings.showEventRegistration && event.registrationURL.length !== 0}
                                <a href={event.registrationURL} class="flex items-center gap-1" target="_blank">
                                    Register Now
                                    <SquareArrowOutUpRight class="h-4 w-4" />
                                </a>
                            {/if}
                        </div>
                    {/if}
                </div>
            {/if}
        {/each}
    </div>
{/if}

<style>
    :global(*) {
        box-sizing: border-box;
    }

    :global(body) {
        margin: 0;
        padding: 0;
        background:none transparent;
    }

    :global(.centered-div) {
        margin: 0 auto;
        position: absolute;
        max-width: 100vw;
        max-height: 100vh;
        width: calc(min(100vw, 100vh * 16 / 9));
        height: calc(min(100vh, 100vw * 9 / 16));
    }

    .listView {
        padding: 5px;
    }

    .listViewItem {
        display: grid;
        grid-template-columns: 5fr 3fr;
        grid-template-areas:"imgcontain extrainfo";
    }

    .listViewItem.backwards {
        grid-template-columns: 3fr 5fr;
        grid-template-areas: "extrainfo imgcontain";
    }

    .img-container {
        grid-area: imgcontain;
    }

    .extra-info {
        grid-area: extrainfo;
    }

    .extrastuff {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: linear-gradient(180deg,rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 82%, rgba(0, 0, 0, 1) 100%) !important;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        padding: 10px;
    }

    .info {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .extrastuff h2,
    .extrastuff p,
    .extrastuff a {
        color: #ffffff;
        font-family: "Geist", sans-serif;
    }

    .extrastuff a {
        margin-top: 5px;
        border: 1px solid #ffffff;
        width: fit-content;
        padding: 5px;
    }
</style>