<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { Button } from "@/components/ui/button";
    import * as Card from "@/components/ui/card/index";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Switch } from "@/components/ui/switch/index.js";
    import { Textarea } from "@/components/ui/textarea";
    import { changeCalendarSettings } from "@/endpointCalls/changeCalendarSetting.js";
    import { ArrowLeft, CalendarDays, Clock, Copy, Eye, Link2, Shield, Upload, X } from "@lucide/svelte";
    import { Spinner } from "$lib/components/ui/spinner/index.js";
    import { toast } from "svelte-sonner";
    import { clearFileInput } from "@/utils.js";

    let { data } = $props();

    let avatarLink = $derived(data.selectedCalendar.logo ? `${data.pb_url}/api/files/${data.selectedCalendar.collectionId}/${data.selectedCalendar.id}/${data.selectedCalendar.logo}` : "")
    let uploadNewAvatar: File | null = $state(null);
    let uploadNewAvatarLink = $derived(uploadNewAvatar ? URL.createObjectURL(uploadNewAvatar) : null);

    let calendarName = $derived(data.selectedCalendar.name);
    let calendarDescription = $derived(data.selectedCalendar.description);

    let passwordEnabled = $derived(data.selectedCalendar.passwordEnabled);
    let newPassword = $state("");

    let saveRequired = $state(false);

    // This effect checks if any configurations have changed. If so, the saveRequired state will be set to true.
    $effect(() => {
        const passwordEnableHasChanged = passwordEnabled !== data.selectedCalendar.passwordEnabled;
        const newAvatarUploaded = uploadNewAvatar !== null;
        const currentAvatarRemoved = avatarLink !== (data.selectedCalendar.logo ? `${data.pb_url}/api/files/${data.selectedCalendar.collectionId}/${data.selectedCalendar.id}/${data.selectedCalendar.logo}` : "");
        const newPasswordCreated = newPassword.length !== 0;
        const nameChanged = calendarName !== data.selectedCalendar.name;
        const descriptionChanged = calendarDescription !== data.selectedCalendar.description;

        saveRequired = passwordEnableHasChanged || newAvatarUploaded || currentAvatarRemoved || newPasswordCreated || nameChanged || descriptionChanged;
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
        const success = await changeCalendarSettings(data.selectedCalendar.id, calendarName, calendarDescription, passwordEnabled, newPassword, avatarLink, uploadNewAvatar);
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
</script>

<svelte:head>
    <title>{data.selectedCalendar.name} | TailorCal</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-6">
    {#if saveRequired}
        <div class="w-full stickySidebar z-50">
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
        <h1 class="text-3xl font-bold text-foreground">Calendar Details</h1>
        <p class="text-muted-foreground mt-1">Manage your calendar settings and view bookings</p>
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
                        <div class="w-24 h-24 rounded-lg flex items-center justify-center bg-accent">
                            <CalendarDays class="h-10 w-10 text-white" />
                        </div>
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
                <p class="text-sm text-muted-foreground">Require a password to book this calendar</p>
                </div>
                <Switch id="password-protection" bind:checked={passwordEnabled} />
            </div>

            {#if passwordEnabled}
                <div class="space-y-2 pt-2">
                <Label for="password">Calendar Password</Label>
                <Input id="password" bind:value={newPassword} type="password" placeholder="Enter password" />
                </div>
            {/if}
            </Card.Content>
        </Card.Root>

        <Card.Root>
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
                    <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-accent">
                    <CalendarDays class="h-6 w-6 text-white" />
                    </div>
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
        </Card.Root>
        </div>

        <div class="space-y-6 stickySidebar h-fit">
        <Card.Root>
            <Card.Header>
            <Card.Title>Booking Link</Card.Title>
            <Card.Description>Share this link with others</Card.Description>
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
            <Button class="w-full gap-2">
                <Eye class="h-4 w-4" />
                Preview Page
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
                <span class="text-muted-foreground">This Month</span>
                <span class="font-semibold text-foreground">8</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Completion Rate</span>
                <span class="font-semibold text-foreground">94%</span>
                </div>
            </div>
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Header>
            <Card.Title>Quick Actions</Card.Title>
            </Card.Header>
            <Card.Content class="space-y-2">
            <Button variant="outline" class="w-full justify-start bg-transparent">
                View All Bookings
            </Button>
            <Button variant="outline" class="w-full justify-start bg-transparent">
                Edit Availability
            </Button>
            <Button
                variant="outline"
                class="w-full justify-start text-destructive hover:text-destructive bg-transparent"
            >
                Delete Calendar
            </Button>
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