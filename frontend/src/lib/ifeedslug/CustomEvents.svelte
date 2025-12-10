<script lang="ts">
    import { cn, type CustomEventIFeedDBModel, type ImageFeedDBModel } from "@/utils";
    import * as Table from "$lib/components/ui/table/index.js";
    import Button, { buttonVariants } from "@/components/ui/button/button.svelte";
    import * as Sheet from "$lib/components/ui/sheet/index.js";
    import UpdateCustomEvent from "./UpdateCustomEvent.svelte";
    import * as Empty from "$lib/components/ui/empty/index.js";
    import Badge from "@/components/ui/badge/badge.svelte";
    import { FolderCodeIcon, ImagePlus } from "@lucide/svelte";
    import CreateCustomEvent from "./CreateCustomEvent.svelte";
    import { invalidateAll } from "$app/navigation";
    import { deleteCustomIFeedEvent } from "@/endpointCalls/deleteCustomIFeedEvent";
    import * as Dialog from "@/components/ui/dialog";

    let { customEvents, apiServer, imageFeeds, currentFeedID }: { customEvents: CustomEventIFeedDBModel[], apiServer: string, imageFeeds: ImageFeedDBModel[], currentFeedID: string } = $props();

    let selectedEventIndex = $state(0);
    let showEvent = $state(false);
    let createCustomEventDialog = $state(false);

    function eventClicked(index: number) {
        selectedEventIndex = index;
        showEvent = true;
    }

    async function deleteEvent() {
        const success = await deleteCustomIFeedEvent(customEvents[selectedEventIndex].id);
        if (success) {
            showEvent = false;
            invalidateAll();
        }
    }
</script>
 
{#if customEvents.length > 0}
    <Table.Root>
        <Table.Header>
            <Table.Row>
                <Table.Head class="w-[100px]">Picture</Table.Head>
                <Table.Head>Name</Table.Head>
                <Table.Head>Has Registration</Table.Head>
                <Table.Head class="text-end">Show</Table.Head>
            </Table.Row>
        </Table.Header>

        <Table.Body>
            {#each customEvents as customEvent, index (`customeventrow${customEvent.id}`)}
                <Table.Row onclick={() => eventClicked(index)}>
                    <Table.Cell>
                        <img class="w-full aspect-video rounded-lg object-cover" src="{apiServer}api/files/{customEvent.collectionId}/{customEvent.id}/{customEvent.picture}" alt="@leerob" />
                    </Table.Cell>
                    <Table.Cell class="font-medium">{customEvent.name}</Table.Cell>
                    <Table.Cell>
                        <Badge variant="outline">{customEvent.registrationURL.length > 0 ? "Yes" : "No"}</Badge>
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
        <Button variant="outline" class="w-full" onclick={() => createCustomEventDialog=true}>Add Event</Button>
    </div>
{:else}
    <Empty.Root>
        <Empty.Header>
            <Empty.Media variant="icon">
                <ImagePlus />
            </Empty.Media>
            <Empty.Title>No Additional Events</Empty.Title>
            <Empty.Description>You haven't created any additional events yet.</Empty.Description>
        </Empty.Header>
        <Empty.Content>
            <Button onclick={() => createCustomEventDialog=true}>Create One</Button>
        </Empty.Content>
    </Empty.Root>
{/if}

<Sheet.Root bind:open={showEvent}>
    <Sheet.Content side="right">
        <Sheet.Header>
            <Sheet.Title>{customEvents[selectedEventIndex].name}</Sheet.Title>
            <Sheet.Description>Make changes to the event here. Click save when you're done.</Sheet.Description>
        </Sheet.Header>
        {#if showEvent}
            <UpdateCustomEvent {currentFeedID} {customEvents} {apiServer} {imageFeeds} {selectedEventIndex} />
        {/if}
        <Sheet.Footer>
            <Button form="updateEventForm" type="submit">Save changes</Button>
            <Dialog.Root>
                <Dialog.Trigger class={cn(buttonVariants({ variant: "outline" }), "justify-start text-destructive hover:bg-red-500 bg-transparent")}>
                    Delete Feed
                </Dialog.Trigger>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
                        <Dialog.Description>
                            This action cannot be undone. This will permanently delete this event from our servers. All feeds relying on this event will not work.
                        </Dialog.Description>
                        <Dialog.Footer>
                            <Button variant="destructive" type="reset" onclick={deleteEvent}>Confirm Delete</Button>
                        </Dialog.Footer>
                    </Dialog.Header>
                </Dialog.Content>
            </Dialog.Root>
        </Sheet.Footer>
    </Sheet.Content>
</Sheet.Root>

<CreateCustomEvent iFeedId={currentFeedID} bind:dialogOpen={createCustomEventDialog} />