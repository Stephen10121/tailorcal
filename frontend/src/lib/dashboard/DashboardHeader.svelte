<script lang="ts">
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import EverythingSearch from "@/EverythingSearch.svelte";
    import { Button, buttonVariants } from "@/components/ui/button";
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import { Bell, Settings } from "@lucide/svelte";
    import type { RecordModel } from "pocketbase";
    import { cn } from "@/utils";

    let { avatar, user, calendars }: { avatar: string, user: RecordModel, calendars: RecordModel[] } = $props();
</script>

<header class="h-16 border-b border-border bg-card">
    <div class="flex h-full items-center gap-4 px-6">
        <div class="flex-1 relative flex items-center gap-4">
            <EverythingSearch {calendars} />
        </div>

        <div class="flex items-center gap-2">
            <Button variant="ghost" size="icon" class="relative hover:bg-primary buttonHover">
            <Bell class="h-5 w-5" />
                <span class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent"></span>
            </Button>

            <Button variant="ghost" class="hover:bg-primary" size="icon">
            <Settings class="h-5 w-5" />
            </Button>

            <DropdownMenu.Root>
                <DropdownMenu.Trigger class={cn(buttonVariants({ variant: "ghost" }), "w-11 h-11 rounded-full hover:bg-primary/50")}>
                    <Avatar.Root class="h-9 w-9">
                        <Avatar.Image src={avatar} alt="Avatar" />
                        <Avatar.Fallback>{user.name[0]}</Avatar.Fallback>
                    </Avatar.Root>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end" class="w-56">
                    <DropdownMenu.Label>My Account</DropdownMenu.Label>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item class="data-highlighted:bg-primary">Profile</DropdownMenu.Item>
                    <DropdownMenu.Item class="data-highlighted:bg-primary">Billing</DropdownMenu.Item>
                    <DropdownMenu.Item class="data-highlighted:bg-primary">Team</DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item class="data-highlighted:bg-primary"><a class="w-full h-full" href="/logout">Log out</a></DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>
    </div>
</header>

<style>
    :global(.buttonHover:hover span) {
        background-color: rgb(61, 152, 212);
    }
</style>