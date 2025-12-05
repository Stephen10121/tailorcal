<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
    import * as Avatar from "@/components/ui/avatar";
    import Badge from "@/components/ui/badge/badge.svelte";
    import Button, { buttonVariants } from "@/components/ui/button/button.svelte";
    import type { CustomEventIFeedDBModel } from "@/utils";
    import * as Sheet from "$lib/components/ui/sheet/index.js";
    import { Label } from "@/components/ui/label";
    import { Input } from "@/components/ui/input";
    import Textarea from "@/components/ui/textarea/textarea.svelte";
    import { Switch } from "@/components/ui/switch";
    import { RangeCalendar } from "@/components/ui/range-calendar";
    import { getLocalTimeZone, today } from "@internationalized/date";

    let { customEvents, apiServer }: { customEvents: CustomEventIFeedDBModel[], apiServer: string } = $props();

    let showEvent = $state(false);
    let selectedEventIndex = $state(0);

    const start = today(getLocalTimeZone());
    const end = start.add({ days: 7 });

    let value = $state({
        start,
        end
    });

    function eventClicked(index: number) {
        selectedEventIndex = index;
        showEvent = true;
    }
</script>
 
<Table.Root>
    <Table.Header>
        <Table.Row>
            <Table.Head class="w-[100px]">Name</Table.Head>
            <Table.Head>Has Registration</Table.Head>
            <Table.Head>Picture</Table.Head>
            <Table.Head class="text-end">Show</Table.Head>
        </Table.Row>
    </Table.Header>

    <Table.Body>
        {#each customEvents as customEvent, index (`customeventrow${customEvent.id}`)}
            <Table.Row onclick={() => eventClicked(index)}>
                <Table.Cell class="font-medium">{customEvent.name}</Table.Cell>
                <Table.Cell>
                    <Badge variant="outline">{customEvent.registrationURL.length > 0 ? "Yes" : "No"}</Badge>
                </Table.Cell>
                <Table.Cell>
                    <Avatar.Root>
                        <Avatar.Image src="{apiServer}api/files/{customEvent.collectionId}/{customEvent.id}/{customEvent.picture}" alt="@leerob" />
                        <Avatar.Fallback>LR</Avatar.Fallback>
                    </Avatar.Root>
                </Table.Cell>
                <Table.Cell class="text-end">
                    {#if customEvent.show}
                        <Badge variant="outline" class="bg-green-200">Yes</Badge>
                    {:else}
                        <Badge variant="outline" class="bg-red-200">No</Badge>
                    {/if}
                </Table.Cell>
            </Table.Row>
        {/each}
    </Table.Body>
</Table.Root>
<div class="w-full flex items-center justify-center mt-2">
    <Button variant="outline" class="w-full">Add Event</Button>
</div>

<Sheet.Root bind:open={showEvent}>
    <Sheet.Content side="right">
        <Sheet.Header>
            <Sheet.Title>{customEvents[selectedEventIndex].name}</Sheet.Title>
            <Sheet.Description>Make changes to the event here. Click save when you're done.</Sheet.Description>
        </Sheet.Header>
        <div class="grid flex-1 auto-rows-min gap-5 px-4">
            <div class="grid gap-2">
                <Label for="name" class="text-end">Name</Label>
                <Input id="name" value={customEvents[selectedEventIndex].name} />
            </div>

            <div class="grid gap-2">
                <Label for="description" class="text-end">Description</Label>
                <Textarea id="description" value={customEvents[selectedEventIndex].description} />
            </div>

            <div class="grid gap-2">
                <Label for="registrationURL" class="text-end">Registration URL</Label>
                <Input id="registrationURL" value={customEvents[selectedEventIndex].registrationURL} placeholder='e.g. "https://event123.example.com/register"' />
            </div>

            <div class="flex items-center justify-between space-x-2">
                <Label for="showEvent" class="flex flex-col items-start space-y-1 cursor-pointer">
                    <span class="font-medium">Show Event</span>
                </Label>
                <Switch
                    id="showEvent"
                    checked={customEvents[selectedEventIndex].show}
                />
            </div>

            <div class="flex w-full justify-center">
                <RangeCalendar bind:value class="rounded-md border" />
            </div>
        </div>
        <Sheet.Footer>
            <Sheet.Close class={buttonVariants({ variant: "default" })}>Save changes</Sheet.Close>
        </Sheet.Footer>
    </Sheet.Content>
</Sheet.Root>