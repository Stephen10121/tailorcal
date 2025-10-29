<script lang="ts">
    import Calendar from '@/Calendar.svelte';
    import * as Popover from "$lib/components/ui/popover/index.js";
    import { CircleQuestionMark, Fullscreen } from '@lucide/svelte';
    import { Label } from '@/components/ui/label/index.js';
    import { Switch } from '@/components/ui/switch/index.js';
    import Button from '@/components/ui/button/button.svelte';
    import { toggleFullScreen } from '@/utils.js';

    let { data } = $props();

    let invisibleTooltip = $state(false);
</script>

<svelte:head>
    <title>{data.name}</title>
    <link rel="shortcut icon" href={data.logoLink} type="image/x-icon">
</svelte:head>

<div id="cal-root" class="dark min-h-screen w-full p-6 bg-background relative">
    <Calendar events={data.events} />
    <Popover.Root>
        <Popover.Trigger class="absolute bottom-1 right-1 z-50 {invisibleTooltip ? "text-background bg-background" : "text-muted-foreground bg-foreground"} rounded p-2" style={invisibleTooltip ? "border:none;" : "border: 1px solid #333333"}>
            <CircleQuestionMark />
        </Popover.Trigger>
        <Popover.Content class="text-muted-foreground bg-foreground rounded p-2" style="border: 1px solid #333333">
            <div class="dark flex items-center gap-2 justify-between">
                <Label for="useinvis" class="dark text-sm">Hide tooltip (you can still click it)</Label>
                <Switch class="dark" id="useinvis" bind:checked={invisibleTooltip} />
            </div>
            <Button onclick={toggleFullScreen} title="Fullscreen"><Fullscreen /></Button>
        </Popover.Content>
    </Popover.Root>
</div>