<script lang="ts">
    import Features from "@/landingPage/Features.svelte";
    import Header from "@/landingPage/Header.svelte";
    import Stats from "@/landingPage/Stats.svelte";
    import Hero from "@/landingPage/Hero.svelte";
    import CTA from "@/landingPage/CTA.svelte";
    import AlphaWarning from "@/landingPage/AlphaWarning.svelte";
</script>

<svelte:head>
    <title>TailorCal</title>
</svelte:head>

<AlphaWarning />
<Header />
<Hero />
<Features />
<Stats />
<CTA />