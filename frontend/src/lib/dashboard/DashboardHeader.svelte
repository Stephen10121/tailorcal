<script lang="ts">
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import { Button, buttonVariants } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Bell, Search, Settings } from "@lucide/svelte";
    import type { RecordModel } from "pocketbase";
    import { cn } from "@/utils";

    let { avatar, user }: { avatar: string, user: RecordModel } = $props();

    let everythingInput: HTMLInputElement | null = $state(null);

    function keyDown(event: KeyboardEvent) {
        if (event.key === "/" && everythingInput) {
            everythingInput.focus();
            setTimeout(() => {
                if (everythingInput) everythingInput.value = "";
            }, 1);
        }
    }
</script>

<svelte:window onkeydown={keyDown} />

<header class="h-16 border-b border-border bg-card">
    <div class="flex h-full items-center gap-4 px-6">
        <div class="flex-1 flex items-center gap-4">
            <div class="relative w-full max-w-md">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input bind:ref={everythingInput} placeholder="Search appointments, contacts..." class="pl-9 bg-background" />
            </div>
        </div>

        <div class="flex items-center gap-2">
            <Button variant="ghost" size="icon" class="relative">
            <Bell class="h-5 w-5" />
                <span class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent"></span>
            </Button>

            <Button variant="ghost" class="hover:bg-secondary" size="icon">
            <Settings class="h-5 w-5" />
            </Button>

            <DropdownMenu.Root>
                <DropdownMenu.Trigger class={cn(buttonVariants({ variant: "ghost" }), "w-11 h-11 rounded-full")}>
                    <Avatar.Root class="h-9 w-9">
                        <Avatar.Image src={avatar} alt="Avatar" />
                        <Avatar.Fallback>{user.name[0]}</Avatar.Fallback>
                    </Avatar.Root>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end" class="w-56">
                    <DropdownMenu.Label>My Account</DropdownMenu.Label>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item>Profile</DropdownMenu.Item>
                    <DropdownMenu.Item>Billing</DropdownMenu.Item>
                    <DropdownMenu.Item>Team</DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item><a class="w-full h-full" href="/logout">Log out</a></DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>
    </div>
</header>