<script lang="ts">
    import Autoplay from "embla-carousel-autoplay";
    import * as Carousel from "$lib/components/ui/carousel/index.js";
    import { SquareArrowOutUpRight } from "@lucide/svelte";
    import type { CarouselAPI } from "@/components/ui/carousel/context.js";

    let { data } = $props();

    let displaySettings = $derived(data.displaySettings);

    let api = $state<CarouselAPI>();

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

<div class="min-h-screen min-w-screen">
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
        class="min-w-screen min-h-screen"
    >
        <Carousel.Content>
            {#each data.events as event (`anEvent${event.id}`)}
                <Carousel.Item class="w-full h-full">
                    <div class="image-parent">
                        <img src={event.imageURL} alt={event.name} class="">
                        {#if displaySettings.showEventExtraInfo && (displaySettings.showEventName || (displaySettings.showEventDescription && event.description.length > 0) || (displaySettings.showEventRegistration && event.registrationURL.length !== 0))}
                            <div class="extrastuff">
                                <div class="info">
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
                            </div>
                        {/if}
                    </div>
                </Carousel.Item>
            {/each}
        </Carousel.Content>
    </Carousel.Root>
</div>
 
<style>
    :global(body) {
        background-color: #ffffff00 !important;
    }

    .image-parent {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        position: relative;
    }

    .image-parent img {
        position: absolute;
        top: 50%;
        left: 50%;
        min-width: 100%;
        min-height: 100%;
        transform: translate(-50%, -50%);
        object-fit: cover; /* preserves aspect ratio, fills */
    }

    .extrastuff {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: linear-gradient(180deg,rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 82%, rgba(0, 0, 0, 1) 100%);
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