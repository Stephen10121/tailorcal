<script lang="ts">
    import { Package,  Warehouse } from "@lucide/svelte";
    import type { EventDBModel } from "./utils";

    let { resources }: { resources: EventDBModel["resources"] } = $props();

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
    <div class="mb-3 flex items-start gap-2 text-sm text-gray-400">
        <Package class="h-4 w-4 mt-0.5 flex-shrink-0" />
        <div>
            <div class="text-gray-400">Resources:</div>
            <div class="text-gray-300">
                {#each res as resource, index}
                    {#if resource.path_name}{resource.path_name}\\{/if}{resource.name}{#if index+1 < res.length},<br>{/if}
                {/each}
            </div>
        </div>
    </div>
{/if}

{#if rooms.length > 0}
    <div class="mb-3 flex items-start gap-2 text-sm text-gray-400">
        <Warehouse class="h-4 w-4 mt-0.5 flex-shrink-0" />
        <div>
            <div class="text-gray-400">Room:</div>
            <div class="text-gray-300">
                {#each rooms as room}
                    {#if room.path_name}{room.path_name}\\{/if}{room.name}
                {/each}
            </div>
        </div>
    </div>
{/if}