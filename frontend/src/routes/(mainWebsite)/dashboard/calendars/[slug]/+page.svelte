<script lang="ts">
    import { ArrowLeft, Clock, Copy, Eye, Link2, Shield, SquareArrowOutUpRight, Upload, X } from "@lucide/svelte";
    import { changeCalendarSettings } from "@/endpointCalls/changeCalendarSetting.js";
    import { Spinner } from "$lib/components/ui/spinner/index.js";
    import NoCalendarAvatar from "@/NoCalendarAvatar.svelte";
    import { Switch } from "@/components/ui/switch/index.js";
    import { Textarea } from "@/components/ui/textarea";
    import * as Card from "@/components/ui/card/index";
    import { goto, invalidateAll } from "$app/navigation";
    import { Button, buttonVariants } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { clearFileInput, cn } from "@/utils.js";
    import { toast } from "svelte-sonner";
    import { deleteCalendar } from "@/endpointCalls/deleteCalendar.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";

    let { data } = $props();

    let avatarLink = $derived(data.selectedCalendar.logo ? `${data.pb_url}/api/files/${data.selectedCalendar.collectionId}/${data.selectedCalendar.id}/${data.selectedCalendar.logo}` : "");
    
    let uploadNewAvatar: File | null = $state(null);
    let uploadNewAvatarLink = $derived(uploadNewAvatar ? URL.createObjectURL(uploadNewAvatar) : null);

    let passwordScreenMessage = $derived(data.selectedCalendar.passwordScreenMessage);
    let calendarDescription = $derived(data.selectedCalendar.description);
    let passwordEnabled = $derived(data.selectedCalendar.passwordEnabled);
    let calendarName = $derived(data.selectedCalendar.name);
    let saveRequired = $state(false);
    let newPassword = $state("");

    // This effect checks if any configurations have changed. If so, the saveRequired state will be set to true.
    $effect(() => {
        const passwordEnableHasChanged = passwordEnabled !== data.selectedCalendar.passwordEnabled;
        const newAvatarUploaded = uploadNewAvatar !== null;
        const currentAvatarRemoved = avatarLink !== (data.selectedCalendar.logo ? `${data.pb_url}/api/files/${data.selectedCalendar.collectionId}/${data.selectedCalendar.id}/${data.selectedCalendar.logo}` : "");
        const newPasswordCreated = newPassword.length !== 0;
        const nameChanged = calendarName !== data.selectedCalendar.name;
        const descriptionChanged = calendarDescription !== data.selectedCalendar.description;
        const passwordScreenMessageChanged = passwordScreenMessage !== data.selectedCalendar.passwordScreenMessage;

        saveRequired = passwordEnableHasChanged || newAvatarUploaded || currentAvatarRemoved || newPasswordCreated || nameChanged || descriptionChanged || passwordScreenMessageChanged;
    });

    function handleRemoveAvatar() {
        clearFileInput(document.getElementById("imageUploaderCalendar"))
        uploadNewAvatar = null;
        avatarLink = "";
    }

    function handleAvatarChange(event: Event & { currentTarget: EventTarget & HTMLInputElement; }) {
        //@ts-ignore
        const files = event.target.files as File[];
        if (files.length === 0) return;
        uploadNewAvatar = files[0];
        avatarLink = "";
    }

    function handleCopyLink() {
        const link = `${window.location.origin}/cal/${data.selectedCalendar.id}`;

        navigator.clipboard.writeText(link);

        toast.info("Copied", {
            description: link,
            descriptionClass: "underline"
        })
    }

    let savingChanges = $state(false);
    async function saveChanges() {
        savingChanges = true;
        const success = await changeCalendarSettings(data.selectedCalendar.id, calendarName, calendarDescription, passwordEnabled, newPassword, avatarLink, uploadNewAvatar, passwordScreenMessage);
        newPassword = "";
        savingChanges = false;
        if (success) {
            clearFileInput(document.getElementById("imageUploaderCalendar"));
            uploadNewAvatar = null;
            let updating = toast.info("Updating Calendar");
            await invalidateAll();
            toast.dismiss(updating);
        }
    }

    async function deleteCal() {
        savingChanges = true;
        const success = await deleteCalendar(data.selectedCalendar.id);
        newPassword = "";
        savingChanges = false;
        if (success) {
            goto("/dashboard/calendars");
        }
    }
</script>

<svelte:head>
    <title>{data.selectedCalendar.name} | TailorCal</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-6">
    {#if saveRequired}
        <div class="w-full stickySidebar z-50 p-2">
            <div class="bg-foreground w-full p-3 shadow-2xl border rounded-md flex items-center justify-between">
                <p class="text-accent-foreground">You have some unsaved changes.</p>
                <Button variant="outline" disabled={savingChanges} onclick={saveChanges}>
                    {#if savingChanges}
                        <Spinner />
                        Saving Changes...
                    {:else}
                        Save Changes
                    {/if}
                </Button>
            </div>
        </div>
    {/if}
    <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" href="/dashboard/calendars">
            <ArrowLeft class="h-5 w-5" />
        </Button>
        <div>
        <h1 class="text-3xl font-bold text-foreground">{data.selectedCalendar.name} | Calendar Details</h1>
        <p class="text-muted-foreground mt-1">Manage your calendar settings and filters.</p>
        </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-6">
        <Card.Root>
            <Card.Header>
            <Card.Title>Calendar Avatar</Card.Title>
            <Card.Description>Upload an image to represent your calendar</Card.Description>
            </Card.Header>
            <Card.Content>
            <div class="flex items-start gap-6">
                <div class="relative">
                    {#if avatarLink.length > 0 || uploadNewAvatar}
                        <div class="relative group">
                            <img
                                src={uploadNewAvatar !== null ? uploadNewAvatarLink : avatarLink}
                                alt="Calendar avatar"
                                class="w-24 h-24 rounded-lg object-cover border-2 border-border"
                            />
                            <button
                                onclick={handleRemoveAvatar}
                                class="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X class="h-4 w-4" />
                            </button>
                        </div>
                    {:else}
                        <NoCalendarAvatar />
                    {/if}
                </div>
                <div class="flex-1 space-y-3">
                <div>
                    <p class="text-sm text-foreground font-medium">Upload a custom avatar</p>
                    <p class="text-sm text-muted-foreground mt-1">
                    JPG, PNG or GIF. Max size 2MB. Recommended 400x400px.
                    </p>
                </div>
                <div class="flex gap-2">
                    <Button variant="outline" class="relative bg-transparent">
                    <Upload class="h-4 w-4 mr-2" />
                    Upload Image
                    <input
                        id="imageUploaderCalendar"
                        type="file"
                        accept="image/*"
                        onchange={handleAvatarChange}
                        class="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    </Button>
                    {#if uploadNewAvatar}
                        <Button variant="outline" onclick={handleRemoveAvatar} class="bg-transparent">
                            Remove
                        </Button>
                    {/if}
                </div>
                </div>
            </div>
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Header>
            <Card.Title>General Information</Card.Title>
            <Card.Description>Basic details about your calendar</Card.Description>
            </Card.Header>
            <Card.Content class="space-y-4">
            <div class="space-y-2">
                <Label for="calendar-id">Calendar ID</Label>
                <Input id="calendar-id" value={data.selectedCalendar.id} disabled class="font-mono text-sm" />
            </div>

            <div class="space-y-2">
                <Label for="calendar-name">Calendar Name</Label>
                <Input
                id="calendar-name"
                bind:value={calendarName}
                placeholder="Enter calendar name"
                />
            </div>

            <div class="space-y-2">
                <Label for="calendar-description">Description</Label>
                <Textarea
                id="calendar-description"
                bind:value={calendarDescription}
                placeholder="Enter calendar description"
                rows={3}
                />
            </div>
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Header>
            <Card.Title>Security Settings</Card.Title>
            <Card.Description>Control access to your calendar</Card.Description>
            </Card.Header>
            <Card.Content class="space-y-4">
                <div class="flex items-center justify-between">
                    <div class="space-y-0.5">
                    <Label for="password-protection" class="text-base">
                        Password Protection
                    </Label>
                    <p class="text-sm text-muted-foreground">Require a password to access this calendar</p>
                    </div>
                    <Switch id="password-protection" bind:checked={passwordEnabled} />
                </div>

                {#if passwordEnabled}
                    <div class="space-y-2 pt-2">
                        <Label for="password">Calendar Password</Label>
                        <Input id="password" bind:value={newPassword} type="password" placeholder="Enter password" />
                    </div>
                    <div class="space-y-2">
                        <Label for="passwordScreenMessage">Password Screen Message</Label>
                        <Textarea
                        id="passwordScreenMessage"
                        bind:value={passwordScreenMessage}
                        placeholder="Enter Password Screen Message"
                        rows={3}
                        />
                    </div>
                {/if}
            </Card.Content>
        </Card.Root>

        <!-- <Card.Root>
            <Card.Header>
            <Card.Title>Calendar Preview</Card.Title>
            <Card.Description>How your calendar appears to visitors</Card.Description>
            </Card.Header>
            <Card.Content>
            <div class="border border-border rounded-lg p-6 bg-muted/30">
                <div class="flex items-start gap-4">
                {#if avatarLink.length > 0 || uploadNewAvatar}
                    <img
                    src={uploadNewAvatar !== null ? uploadNewAvatarLink : avatarLink}
                    alt="Calendar avatar"
                    class="w-12 h-12 rounded-lg object-cover"
                    />
                {:else}
                    <NoCalendarAvatar />
                {/if}
                <div class="flex-1">
                    <h3 class="text-xl font-semibold text-foreground">{calendarName}</h3>
                    <p class="text-sm text-muted-foreground mt-1">{calendarDescription}</p>
                    <div class="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                    <Clock class="h-4 w-4" />
                    {#if passwordEnabled}
                        <span>•</span>
                        <Shield class="h-4 w-4" />
                        <span>Password Protected</span>
                    {/if}
                    </div>
                </div>
                </div>
            </div>
            </Card.Content>
        </Card.Root> -->
        </div>

        <div class="space-y-6 stickySidebar h-fit">
        <Card.Root>
            <Card.Header>
            <Card.Title>Link</Card.Title>
            <Card.Description>Share this calendar with others</Card.Description>
            </Card.Header>
            <Card.Content class="space-y-3">
            <div class="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Link2 class="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span class="text-sm font-mono truncate">/cal/{data.selectedCalendar.id}</span>
            </div>
            <Button onclick={handleCopyLink} class="w-full gap-2 bg-transparent" variant="outline">
                <Copy class="h-4 w-4" />
                Copy Link
            </Button>
            <Button class="w-full gap-2" href="/cal/{data.selectedCalendar.id}" target="_blank">
                <SquareArrowOutUpRight class="h-4 w-4" />
                Goto Page
            </Button>
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Header>
            <Card.Title>Statistics</Card.Title>
            <Card.Description>Calendar performance</Card.Description>
            </Card.Header>
            <Card.Content class="space-y-4">
            <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Visits</span>
                <span class="font-semibold text-foreground">{data.selectedCalendar.visits}</span>
                </div>
            </div>
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Header>
            <Card.Title>Quick Actions</Card.Title>
            </Card.Header>
            <Card.Content class="space-y-2">
                <!-- Delete Calendar Dialog -->
                <Dialog.Root>
                    <Dialog.Trigger class={cn(buttonVariants({ variant: "outline" }), "w-full justify-start text-destructive hover:bg-red-500 bg-transparent")}>
                        Delete Calendar
                    </Dialog.Trigger>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
                            <Dialog.Description>
                                This action cannot be undone. This will permanently delete this calendar from our servers. All links relying on this calendar will not work.
                            </Dialog.Description>
                            <Dialog.Footer>
                                <Button variant="destructive" onclick={deleteCal}>Confirm Delete</Button>
                            </Dialog.Footer>
                        </Dialog.Header>
                    </Dialog.Content>
                </Dialog.Root>
            </Card.Content>
        </Card.Root>
        </div>
    </div>
</div>

<style>
    .stickySidebar {
        position: -webkit-sticky;
        position: sticky;
        top: 0;
    }
</style>