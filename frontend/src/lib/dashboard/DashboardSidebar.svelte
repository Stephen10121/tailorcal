<script lang="ts">
    import { cn } from "@/utils";
    import { Calendar, Home, BarChart3 } from "@lucide/svelte";

    let { pathname }: { pathname: string } = $props();
    
    const navigation = [
      { name: "Dashboard", icon: Home, href: "/dashboard", current: true },
      { name: "Calendars", icon: Calendar, href: "/dashboard/calendars", current: false },
      { name: "Analytics", icon: BarChart3, href: "/dashboard/analytics", current: false },
    ]
</script>

<aside class="w-64 border-r border-border bg-card">
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
                pathname === route.href ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
            >
                <route.icon class="h-5 w-5" />
                {route.name}
            </a>
        {/each}
    </nav>
</aside>
