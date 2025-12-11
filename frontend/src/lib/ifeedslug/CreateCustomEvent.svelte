<script lang="ts">
    import { DateFormatter } from "@internationalized/date";
    import { createCustomIFeedEvent } from "@/endpointCalls/createCustomIFeedEvent";
    import { Button } from "@/components/ui/button";
    import { Upload, X } from "@lucide/svelte";
    import * as Dialog from "@/components/ui/dialog";
    import { invalidateAll } from "$app/navigation";
    import { Switch } from "@/components/ui/switch";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { clearFileInput } from "@/utils";
    import { toast } from "svelte-sonner";

    let { iFeedId, dialogOpen = $bindable() }: { iFeedId: string, dialogOpen: boolean } = $props();

    let linkText = $state("");
    let showLink = $state(false);
    let registrationURL = $state("");
    let uploadNewEventPicture: File | null = $state(null);
    let uploadNewEventPictureLink = $derived(uploadNewEventPicture ? URL.createObjectURL(uploadNewEventPicture) : null);

    async function handleCreateEvent() {
        if (!uploadNewEventPicture || (showLink && (registrationURL.length === 0 || linkText.length === 0))) {
            toast.error("Missing Data!", { description: "Please fill the required fields." });
            return;
        }

        const savingChangesToast = toast.loading("Saving changes!");
        const success = await createCustomIFeedEvent(linkText, registrationURL, [ iFeedId ], showLink, uploadNewEventPicture);

        if (success) {
            clearFileInput(document.getElementById("imageUploaderIFeed"));
            uploadNewEventPicture = null;
            linkText = "";
            registrationURL = "";
            showLink = false;
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
            <Dialog.Title>Add Image</Dialog.Title>
            <Dialog.Description>Add an image to this feed.</Dialog.Description>
        </Dialog.Header>
        <div class="space-y-4 py-4">
            <div class="space-y-2">
                <Label for="event-picture">Picture*</Label>
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
                    Add Link
                </Label>
                <p class="text-sm text-muted-foreground">This adds a button that lets people click a custom link.</p>
                </div>
                <Switch
                    id="event-show"
                    bind:checked={showLink}
                />
            </div>
            {#if showLink}
                <div class="space-y-2">
                    <Label for="event-name">Link Button Text</Label>
                    <Input
                        id="event-name"
                        placeholder="Link Button Text"
                        bind:value={linkText}
                    />
                </div>
                <div class="space-y-2">
                    <Label for="event-registration">Link URL</Label>
                    <Input
                        id="event-registration"
                        type="url"
                        placeholder="https://example.com/register"
                        bind:value={registrationURL}
                    />
                </div>
            {/if}
        </div>
        <Dialog.Footer>
            <Button variant="outline" onclick={() => dialogOpen = false} class="bg-transparent">
                Cancel
            </Button>
            <Button onclick={handleCreateEvent}>Save</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>