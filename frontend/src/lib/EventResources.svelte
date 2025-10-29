<script lang="ts">
    import { Package,  Warehouse } from "@lucide/svelte";
    import type { EventDBModel } from "./utils";

    let { resources, showResourcePathname }: { resources: EventDBModel["resources"], showResourcePathname: boolean } = $props();

    let res: Exclude<EventDBModel["resources"], null> = $state([]);
    let rooms: Exclude<EventDBModel["resources"], null> = $state([]);

    $effect(() => {
        if (resources !== null) {
            try {
                res = resources.filter((resource) => resource.kind === "Resource");
                rooms = resources.filter((resource) => resource.kind === "Room");
            } catch(err) {
                console.log(err);
            }
        }
    });
</script>

{#if res.length > 0}
    <div class="flex items-start gap-2 text-sm text-gray-400">
        <Package class="h-4 w-4 mt-0.5 flex-shrink-0" />
        <div class="flex gap-0.5">
            <div class="text-gray-400">Resources:</div>
            <div class="text-gray-300">
                {#each res as resource, index}
                    {#if resource.path_name && showResourcePathname}{resource.path_name}\\{/if} {resource.name}{#if index+1 < res.length}, {/if}
                {/each}
            </div>
        </div>
    </div>
{/if}

{#if rooms.length > 0}
    <div class="flex items-start gap-2 text-sm text-gray-400">
        <Warehouse class="h-4 w-4 mt-0.5 flex-shrink-0" />
        <div class="flex gap-0.5">
            <div class="text-gray-400">Room:</div>
            <div class="text-gray-300">
                {#each rooms as room, index}
                    {#if room.path_name}{room.path_name}\\{/if} {room.name}{#if index+1 < rooms.length}, {/if}
                {/each}
            </div>
        </div>
    </div>
{/if}