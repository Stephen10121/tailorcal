<script lang="ts">
    import * as Kbd from "$lib/components/ui/kbd/index.js";
    import type { RecordModel } from "pocketbase";
    import { Input } from "@/components/ui/input";
    import {  Search, } from "@lucide/svelte";
    import Badge from "./components/ui/badge/badge.svelte";

    let { calendars }: { calendars: RecordModel[] } = $props();

    let everythingInput: HTMLInputElement | null = $state(null);
    let everythingInputFocused = $state(false);

    let filteredTerms: RecordModel[] = $state([]);

    function searchInputChanged(event: Event) {
        //@ts-ignore
        const searchTerm = event.target.value.toLowerCase();
        if (!searchTerm) {
            filteredTerms = [];
            return
        }

        filteredTerms = calendars.filter((calendar) => {
            return calendar.id.toLowerCase().includes(searchTerm) ||
            calendar.name.toLowerCase().includes(searchTerm) ||
            calendar.description.toLowerCase().includes(searchTerm) ||
            "calendar".includes(searchTerm)
        });
    }

    function keyDown(event: KeyboardEvent) {
        if (event.key === "/" && everythingInput && !everythingInputFocused) {
            event.preventDefault();
            everythingInput.focus();
        }
    }
</script>

<svelte:window onkeydown={keyDown} />

<div class="relative w-full max-w-md">
    <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <div class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <Kbd.Root>/</Kbd.Root>
    </div>
    <Input
        bind:ref={everythingInput}
        onfocusin={() => everythingInputFocused=true}
        onfocusout={() => setTimeout(() => everythingInputFocused=false, 200)}
        oninput={searchInputChanged}
        placeholder="Search calendars, webhooks, triggers..."
        class="pl-9 pr-9 bg-background"
    />
</div>

{#if everythingInputFocused && filteredTerms.length > 0}
    <div class="border shadow-lg bg-card absolute left-0 -bottom-1 translate-y-full w-full max-w-md rounded-lg p-1 z-50">
        {#each filteredTerms as term (`filteredSearchTerms${term.id}`)}
            <a
                onclick={() => {if (everythingInput) {
                    everythingInput.value = "";
                    filteredTerms = [];
                }}}
                href="/dashboard/calendars/{term.id}"
                class="w-full px-4 py-3 hover:bg-accent/50 transition-colors text-left flex flex-col gap-1 rounded-md"
            >
                <div class="flex items-center justify-between">
                    <span class="font-medium text-foreground underline">{term.name}</span>
                    <Badge variant="outline">Calendar</Badge>
                    <!-- <span class="text-xs text-muted-foreground">{term.id}</span> -->
                </div>
                <p class="text-sm text-muted-foreground line-clamp-1">{term.description}</p>
            </a>
        {/each}
    </div>
{/if}