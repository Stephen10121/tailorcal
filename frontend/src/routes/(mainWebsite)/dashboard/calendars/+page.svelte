<script lang="ts">
    import { Copy, MoreVertical, Plus, Shield, Trash2, Users } from "@lucide/svelte";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import * as DropdownMenu from "@/components/ui/dropdown-menu/index";
    import { Button, buttonVariants } from "@/components/ui/button";
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import * as Dialog from "@/components/ui/dialog/index";
    import { Textarea } from "@/components/ui/textarea";
    import * as Card from "@/components/ui/card/index";
    import { Label } from "@/components/ui/label";
    import { Input } from "@/components/ui/input";
    import { cn } from "@/utils";
    import { toast } from "svelte-sonner";
    import NoCalendarAvatar from "@/NoCalendarAvatar.svelte";

    let { data } = $props();

    let newCalendarDialogOpen = $state(false);
    let newCalendarDescription = $state("");
    let newCalendarName = $state("");

    function handleCreateCalendar() {
        if (newCalendarName && newCalendarDescription) {
            console.log("Creating a calendar.");

            newCalendarName = "";
            newCalendarDescription = ""
            newCalendarDialogOpen = false;
        }
    }

    function copyCalLinkToClipboard(id: string) {
        const link = `${window.location.origin}/cal/${id}`;

        navigator.clipboard.writeText(link);

        toast.info("Copied", {
            description: link,
            descriptionClass: "underline"
        })
    }
</script>

<svelte:head>
    <title>My Calendars | TailorCal</title>
</svelte:head>

<div class="w-full space-y-6">
    <div class="flex items-center justify-between">
        <div>
        <h1 class="text-3xl font-bold text-foreground">My Calendars</h1>
        <p class="text-muted-foreground mt-1">Manage your calendar types and booking links</p>
        </div>

        <Dialog.Root bind:open={newCalendarDialogOpen}>
        <Dialog.Trigger class={cn(buttonVariants({ variant: "default" }), "gap-2")}>
            <Plus class="h-4 w-4" />
            New Calendar
        </Dialog.Trigger>
        <Dialog.Content class="sm:max-w-[500px]">
            <Dialog.Header>
            <Dialog.Title>Create New Calendar</Dialog.Title>
            <Dialog.Description>Set up a new calendar type for your bookings</Dialog.Description>
            </Dialog.Header>

            <div class="space-y-4 py-4">
            <div class="space-y-2">
                <Label for="name">Calendar Name</Label>
                <Input
                id="name"
                placeholder="e.g., 30 Minute Meeting"
                bind:value={newCalendarName}
                />
            </div>

            <div class="space-y-2">
                <Label for="description">Description</Label>
                <Textarea
                id="description"
                placeholder="Brief description of this calendar type"
                bind:value={newCalendarDescription}
                rows={3}
                />
            </div>
            </div>

            <Dialog.Footer>
            <Button variant="outline" onclick={() => newCalendarDialogOpen = false}>
                Cancel
            </Button>
            <Button onclick={handleCreateCalendar}>Create Calendar</Button>
            </Dialog.Footer>
        </Dialog.Content>
        </Dialog.Root>
    </div>

    <div class="grid gap-4 xl:grid-cols-3">
        {#each data.calendars as calendar (`calendarlist${calendar.id}`)}
            <Card.Root class="hover:shadow-lg transition-shadow">
                <Card.Header>
                <div class="flex items-start justify-between">
                    <div class="flex items-center gap-1">
                        <Avatar.Root class="h-15 w-15">
                            <Avatar.Image src="{data.pb_url}/api/files/{calendar.collectionId}/{calendar.id}/{calendar.logo}" alt="Avatar" />
                            <Avatar.Fallback><NoCalendarAvatar /></Avatar.Fallback>
                        </Avatar.Root>
                        <div class={`w-3 h-3 rounded-full ${calendar.color}`}></div>
                        <div>
                            <Card.Title class="text-lg flex">
                                {calendar.name}
                                {#if calendar.passwordEnabled}
                                    <div class="flex items-center gap-1 ml-1 text-xs text-muted-foreground">
                                        <span>•</span>
                                        <Tooltip.Provider>
                                            <Tooltip.Root>
                                                <Tooltip.Trigger>
                                                    <Shield class="h-4 w-4" />
                                                </Tooltip.Trigger>
                                                <Tooltip.Content>Password Protected</Tooltip.Content>
                                            </Tooltip.Root>
                                        </Tooltip.Provider>
                                    </div>
                                {/if}
                            </Card.Title>
                            <Card.Description class="text-sm mt-1">/cal/{calendar.id}</Card.Description>
                        </div>
                    </div>

                    <DropdownMenu.Root>
                    <DropdownMenu.Trigger class={cn(buttonVariants({ variant: "ghost" }), "h-8 w-8 hover:bg-primary/90")}>
                        <MoreVertical class="h-4 w-4" />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content align="end">
                        <DropdownMenu.Item
                            class="data-highlighted:bg-primary dropdownStuff"
                            onclick={() => copyCalLinkToClipboard(calendar.id)}
                        >
                        <Copy class="h-4 w-4 mr-2" />
                        Copy Link
                        </DropdownMenu.Item>
                        <DropdownMenu.Item class="text-destructive data-highlighted:bg-red-500 dropdownStuff">
                        <Trash2 class="h-4 w-4 mr-2" />
                        Delete
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                    </DropdownMenu.Root>
                </div>
                </Card.Header>

                <Card.Content>
                <p class="text-sm text-muted-foreground mb-4">{calendar.description}</p>

                <div class="flex items-center justify-between pt-4 border-t border-border">
                    <div class="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users class="h-4 w-4" />
                    <span>{calendar.visits} Visit{calendar.visits === 1 ? "" : "s"}</span>
                    </div>

                    <Button variant="outline" size="sm" class="hover:bg-primary" href="/dashboard/calendars/{calendar.id}">
                    View Details
                    </Button>
                </div>
                </Card.Content>
            </Card.Root>
        {/each}
    </div>
</div>

<style>
    :global(.dropdownStuff:hover svg) {
        filter: brightness(0) invert(1);
    }
</style>