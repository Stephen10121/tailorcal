<script lang="ts">
    import { DateFormatter, getLocalTimeZone, parseDate, type DateValue } from "@internationalized/date";
    import { clearFileInput, cn, type CustomEventIFeedDBModel, type ImageFeedDBModel } from "@/utils";
    import { updateCustomIFeedEvent } from "@/endpointCalls/updateCustomIfeedEvent";
    import Button, { buttonVariants } from "@/components/ui/button/button.svelte";
    import Textarea from "@/components/ui/textarea/textarea.svelte";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
    import { CalendarIcon, Upload, X } from "@lucide/svelte";
    import * as Popover from "@/components/ui/popover";
    import { Calendar } from "@/components/ui/calendar";
    import { Switch } from "@/components/ui/switch";
    import { invalidateAll } from "$app/navigation";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { toast } from "svelte-sonner";

    let {
        customEvents,
        apiServer,
        imageFeeds,
        currentFeedID,
        selectedEventIndex,
    }: {
        customEvents: CustomEventIFeedDBModel[],
        apiServer: string,
        imageFeeds: ImageFeedDBModel[],
        currentFeedID: string,
        selectedEventIndex: number,
    } = $props();

    const df = new DateFormatter("en-US", { dateStyle: "long" });

    let includeInOtherFeeds = $state(imageFeeds.map((feed) => {
        return {
            id: feed.id,
            name: feed.name,
            include: customEvents[selectedEventIndex].imageFeed.includes(feed.id)
        }
    }))

    let uploadNewEventPicture: File | null = $state(null);
    let uploadNewEventPictureLink = $derived(uploadNewEventPicture ? URL.createObjectURL(uploadNewEventPicture) : null);

    let eventPictureLink = $derived(customEvents[selectedEventIndex].picture ? `${apiServer}api/files/${customEvents[selectedEventIndex].collectionId}/${customEvents[selectedEventIndex].id}/${customEvents[selectedEventIndex].picture}` : "");
    let dateValue = $derived<DateValue | undefined>(parseDate(new Date(customEvents[selectedEventIndex].date).toISOString().split('T')[0]));
    let dateContentRef = $state<HTMLElement | null>(null);

    let name = $state(customEvents[selectedEventIndex].name);
    let description = $state(customEvents[selectedEventIndex].description);
    let registrationURL = $state(customEvents[selectedEventIndex].registrationURL);
    let show = $state(customEvents[selectedEventIndex].show);

    function handleRemoveEventPicture() {
        clearFileInput(document.getElementById("imageUploaderIFeed"))
        uploadNewEventPicture = null;
        eventPictureLink = "";
    }

    function handleEventPictureChange(event: Event & { currentTarget: EventTarget & HTMLInputElement; }) {
        //@ts-ignore
        const files = event.target.files as File[];
        if (files.length === 0) return;
        uploadNewEventPicture = files[0];
    }

    async function updateEvent(event: SubmitEvent) {
        event.preventDefault();
        let included: string[] = [];
        for (let i=0;i<includeInOtherFeeds.length;i++) {
            if (includeInOtherFeeds[i].include) {
                included.push(includeInOtherFeeds[i].id);
            }
        }
        let date = dateValue ? dateValue.toDate(getLocalTimeZone()).getTime() : 0;

        const savingChangesToast = toast.loading("Saving changes!");
        const success = await updateCustomIFeedEvent(customEvents[selectedEventIndex].id, name, description, registrationURL, date, included, show, uploadNewEventPicture, eventPictureLink);
        if (success) {
            clearFileInput(document.getElementById("imageUploaderIFeed"));
            uploadNewEventPicture = null;
            await invalidateAll();
        }
        toast.dismiss(savingChangesToast);
    }
</script>

<form id="updateEventForm" onsubmit={updateEvent} class="grid flex-1 auto-rows-min gap-5 px-4 w-full overflow-y-auto">
    <div class="flex items-start gap-4 flex-col">
        <div class="relative w-full">
            {#if eventPictureLink.length > 0 || uploadNewEventPicture}
                <div class="relative group w-full">
                    <img
                        src={uploadNewEventPicture !== null ? uploadNewEventPictureLink : eventPictureLink}
                        alt="Event Banner"
                        class="aspect-video w-full rounded-lg object-cover border-2 border-border"
                    />
                    <button
                        onclick={handleRemoveEventPicture}
                        class="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X class="h-4 w-4" />
                    </button>
                </div>
            {:else}
                <div class="w-full aspect-video bg-ring/50 rounded-lg flex items-center justify-center">
                    <p class="text-foreground">No Picture</p>
                </div>
            {/if}
        </div>
        <div class="flex-1 space-y-3">
        <div>
            <p class="text-sm text-foreground font-medium">Upload an event picture</p>
            <p class="text-sm text-muted-foreground mt-1">
            JPG, PNG or GIF. Max size 2MB. Recommended 960x540px.
            </p>
        </div>
        <div class="flex gap-2">
            <Button variant="outline" class="relative bg-transparent">
                <Upload class="h-4 w-4 mr-2" />
                Upload Image
                <input
                    name="newEventImage"
                    id="imageUploaderIFeed"
                    type="file"
                    accept="image/*"
                    onchange={handleEventPictureChange}
                    class="absolute inset-0 opacity-0 cursor-pointer"
                />
            </Button>
            {#if uploadNewEventPicture}
                <Button variant="outline" onclick={handleRemoveEventPicture} class="bg-transparent">
                    Remove
                </Button>
            {/if}
        </div>
        </div>
    </div>
    
    <div class="grid gap-2">
        <Label for="name" class="text-end">Name</Label>
        <Input name="eventName" id="name" bind:value={name} />
    </div>

    <div class="grid gap-2">
        <Label for="description" class="text-end">Description</Label>
        <Textarea name="eventDescription" id="description" bind:value={description} />
    </div>

    <div class="grid gap-2">
        <Label for="registrationURL" class="text-end">Registration URL</Label>
        <Input name="eventRegistrationURL" id="registrationURL" bind:value={registrationURL} placeholder='e.g. "https://event123.example.com/register"' />
    </div>

    <div class="grid gap-2">
        <Label for="eventDate" class="flex flex-col items-start space-y-1 cursor-pointer">
            <span class="font-medium">Event Date</span>
        </Label>
        <Popover.Root>
            <Popover.Trigger
                id="eventDate"
                class={cn(
                buttonVariants({
                    variant: "outline",
                    class: "w-full justify-start text-start font-normal"
                }),
                !dateValue && "text-muted-foreground"
                )}
            >
                <CalendarIcon />
                {dateValue ? df.format(dateValue.toDate(getLocalTimeZone())) : "Pick a date"}
            </Popover.Trigger>
            <Popover.Content bind:ref={dateContentRef} class="w-auto p-0">
                <Calendar id="date" type="single" bind:value={dateValue} captionLayout="dropdown" />
            </Popover.Content>
        </Popover.Root>
    </div>

    <div class="flex items-center justify-between space-x-2">
        <Label for="showEvent" class="flex flex-col items-start space-y-1 cursor-pointer">
            <span class="font-medium">Show Event</span>
        </Label>
        <Switch
            name="eventShow"
            id="showEvent"
            bind:checked={show}
        />
    </div>

    {#each includeInOtherFeeds as imageFeed, index (`includeinifeed${imageFeed.id}`)}
        {#if imageFeed.id !== currentFeedID}
            <div class="flex items-center gap-3">
                <Checkbox id="includeinfeed{imageFeed.id}" bind:checked={includeInOtherFeeds[index].include} />
                <Label for="includeinfeed{imageFeed.id}">Include in "{imageFeed.name}" feed.</Label>
            </div>
        {/if}
    {/each}
</form>