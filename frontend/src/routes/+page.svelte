<script lang="ts">
    import { Button } from "@/components/ui/button";

    let { data } = $props();

    let emailNotSet = $state(!data.user?.email);
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
{#if data.user}
    {#if data.user.accessLevel !== "none"}
        <a href="{data.stripeCustomerPortal}?prefilled_email={data.user.email}" target="_blank">Customer Portal</a>
    {:else}
        <Button onclick={() => {
            if (data.user && data.user.email) {
                window.location.replace(data.stripeUrl + "?prefilled_email=" + data.user.email);
            }
        }}>Pay $1 a month.</Button>
    {/if}

    {#if emailNotSet}
        <p>You need to set the email.</p>
    {:else}
        <p>hello {data.user?.email}</p>
    {/if}
    
    <a href="/logout" class="underline">Logout</a>
{:else}
    <form method="post">
        <Button type="submit">Get Started</Button>
    </form>
{/if}