<script lang="ts">
    import Autoplay from "embla-carousel-autoplay";
    import * as Carousel from "$lib/components/ui/carousel/index.js";

    const plugin = Autoplay({ delay: 7000 });

    let { data } = $props();
</script>

<svelte:head>
    <title>{data.name}</title>
    <link rel="shortcut icon" href={data.logoLink} type="image/x-icon">
    <meta name="description" content={data.description}>
</svelte:head>

<div class="min-h-screen min-w-screen">
    <Carousel.Root
        opts={{
            loop: true
        }}
        plugins={[plugin]}
        class="min-w-screen min-h-screen"
    >
        <Carousel.Content>
            {#each data.events as event (`anEvent${event.id}`)}
                <Carousel.Item class="w-full h-full">
                    <div class="image-parent">
                        <img src={event.imageURL} alt={event.name} class="">
                    </div>
                </Carousel.Item>
            {/each}
        </Carousel.Content>
    </Carousel.Root>
</div>
 
<style>
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
</style>