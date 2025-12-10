<script lang="ts">
    import { DateFormatter, getLocalTimeZone, parseDate, type DateValue } from "@internationalized/date";
    import { createCustomIFeedEvent } from "@/endpointCalls/createCustomIFeedEvent";
    import { Button, buttonVariants } from "@/components/ui/button";
    import { CalendarIcon, Upload, X } from "@lucide/svelte";
    import { Calendar } from "@/components/ui/calendar";
    import { Textarea } from "@/components/ui/textarea";
    import * as Popover from "@/components/ui/popover";
    import * as Dialog from "@/components/ui/dialog";
    import { invalidateAll } from "$app/navigation";
    import { Switch } from "@/components/ui/switch";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { clearFileInput, cn } from "@/utils";
    import { toast } from "svelte-sonner";

    let { iFeedId, dialogOpen = $bindable() }: { iFeedId: string, dialogOpen: boolean } = $props();

    const df = new DateFormatter("en-US", { dateStyle: "long" });

    let name = $state("");
    let show = $state(false);
    let description = $state("");
    let registrationURL = $state("");
    let uploadNewEventPicture: File | null = $state(null);
    let uploadNewEventPictureLink = $derived(uploadNewEventPicture ? URL.createObjectURL(uploadNewEventPicture) : null);

    let dateContentRef = $state<HTMLElement | null>(null);
    let dateValue = $derived<DateValue | undefined>(parseDate(new Date().toISOString().split('T')[0]));

    async function handleCreateEvent() {
        if (!uploadNewEventPicture || !description || !name) {
            toast.error("Missing Data!", { description: "Please fill the required fields." });
            return;
        }

        let date = dateValue ? dateValue.toDate(getLocalTimeZone()).getTime() : 0;

        const savingChangesToast = toast.loading("Saving changes!");
        const success = await createCustomIFeedEvent(name, description, registrationURL, date, [ iFeedId ], show, uploadNewEventPicture);

        if (success) {
            clearFileInput(document.getElementById("imageUploaderIFeed"));
            uploadNewEventPicture = null;
            name = "";
            description = "";
            registrationURL = "";
            show = false;
            dateValue = parseDate(new Date().toISOString().split('T')[0]);
            dialogOpen = false;
            await invalidateAll();
        }
        toast.dismiss(savingChangesToast);
    }

    function handleEventPictureChange(event: Event & { currentTarget: EventTarget & HTMLInputElement; }) {
        //@ts-ignore
        const files = event.target.files as File[];
        if (files.length === 0) return;
        uploadNewEventPicture = files[0];
    }

    function handleRemoveEventPicture() {
        clearFileInput(document.getElementById("newCustomEventImageInput"))
        uploadNewEventPicture = null;
    }
</script>

<Dialog.Root bind:open={dialogOpen}>
    <Dialog.Content class="sm:max-w-[500px] max-h-screen overflow-y-auto" style="max-height: calc(100vh - 50px);">
        <Dialog.Header>
            <Dialog.Title>Create New Event</Dialog.Title>
            <Dialog.Description>Add a new event to this calendar</Dialog.Description>
        </Dialog.Header>
        <div class="space-y-4 py-4">
            <div class="space-y-2">
                <Label for="event-name">Event Name*</Label>
                <Input
                    id="event-name"
                    placeholder="Enter event name"
                    bind:value={name}
                />
            </div>

            <div class="space-y-2">
                <Label for="event-description">Description*</Label>
                <Textarea
                    id="event-description"
                    placeholder="Enter event description"
                    bind:value={description}
                    rows={3}
                />
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

            <div class="space-y-2">
                <Label for="event-registration">Registration URL</Label>
                <Input
                    id="event-registration"
                    type="url"
                    placeholder="https://example.com/register"
                    bind:value={registrationURL}
                />
            </div>

            <div class="space-y-2">
                <Label for="event-picture">Event Picture*</Label>
                {#if uploadNewEventPictureLink}
                    <div class="relative">
                        <img
                            src={uploadNewEventPictureLink}
                            alt="Event preview"
                            class="w-full aspect-video object-cover rounded-lg border-2 border-border"
                        />
                        <button
                            onclick={handleRemoveEventPicture}
                            class="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                        >
                            <X class="h-4 w-4" />
                        </button>
                    </div>
                {:else}
                    <div class="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                        <Button variant="outline" class="relative bg-transparent" type="button">
                        <Upload class="h-4 w-4 mr-2" />
                        Upload Image
                        <input
                            type="file"
                            accept="image/*"
                            onchange={handleEventPictureChange}
                            id="newCustomEventImageInput"
                            class="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        </Button>
                        <p class="text-xs text-muted-foreground mt-2">PNG, JPG or GIF. Max 2MB</p>
                    </div>
                {/if}
            </div>

            <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                <Label for="event-show" class="text-base">
                    Show Event
                </Label>
                <p class="text-sm text-muted-foreground">Make this event visible to users</p>
                </div>
                <Switch
                    id="event-show"
                    bind:checked={show}
                />
            </div>
        </div>
        <Dialog.Footer>
            <Button variant="outline" onclick={() => dialogOpen = false} class="bg-transparent">
                Cancel
            </Button>
            <Button onclick={handleCreateEvent}>Create Event</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>