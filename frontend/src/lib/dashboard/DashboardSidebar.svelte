<script lang="ts">
    import { cn } from "@/utils";
    import { Calendar, Home, BarChart3 } from "@lucide/svelte";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import { useSidebar } from "$lib/components/ui/sidebar/index.js";

    const sidebar = useSidebar();

    let { pathname }: { pathname: string } = $props();
    
    const navigation = [
      { title: "Dashboard", icon: Home, url: "/dashboard" },
      { title: "Calendars", icon: Calendar, url: "/dashboard/calendars"  },
      { title: "Analytics", icon: BarChart3, url: "/dashboard/analytics" },
    ]
</script>

<Sidebar.Root collapsible="icon" class="bg-card">
    <Sidebar.Header class="h-16 border-b border-border bg-card">
        {#if sidebar.state === "expanded"}
            <div class="flex h-full w-full items-center gap-2 px-4">
                <Calendar class="h-6 w-6 text-accent" />
                <span class="text-xl font-semibold text-foreground">TailorCal</span>
            </div>
        {:else}
            <div class="flex h-full w-full justify-center items-center">
                <Calendar class="h-6 w-6 text-accent" />
            </div>
        {/if}
    </Sidebar.Header>
    <Sidebar.Content class="{sidebar.state === "expanded" ? "p-2" : ""} bg-card">
        <Sidebar.Group>
        <Sidebar.GroupContent>
            <Sidebar.Menu>
            {#each navigation as item (item.title)}
                <Sidebar.MenuItem>
                    <Sidebar.MenuButton>
                        {#snippet child({ props })}
                            <a href={item.url} {...props} class="flex items-center rounded-lg text-sm font-medium transition-colors {sidebar.state === "expanded" ? "px-3 py-2 gap-3" : "h-8 w-8 justify-center"} {pathname === item.url || (pathname.includes("/dashboard/calendars") && item.url === "/dashboard/calendars") ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-muted hover:text-foreground"}">
                                <item.icon class="h-5 w-5" />
                                {#if sidebar.state === "expanded"}
                                    <span>{item.title}</span>
                                {/if}
                            </a>
                        {/snippet}
                    </Sidebar.MenuButton>
                </Sidebar.MenuItem>
            {/each}
            </Sidebar.Menu>
        </Sidebar.GroupContent>
        </Sidebar.Group>
    </Sidebar.Content>
</Sidebar.Root>
<!-- <aside class="w-64 border-r border-border bg-card">
    <div class="flex h-16 items-center gap-2 px-6 border-b border-border">
        <Calendar class="h-6 w-6 text-accent" />
        <span class="text-xl font-semibold text-foreground">TailorCal</span>
    </div>

    <nav class="p-4 space-y-1">
        {#each navigation as route (`dashboardnav${route.name}`)}
            <a
                href={route.href}
                class={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === route.href || (pathname.includes("/dashboard/calendars") && route.href === "/dashboard/calendars") ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
            >
                <route.icon class="h-5 w-5" />
                {route.name}
            </a>
        {/each}
    </nav>
</aside> -->
