<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { setEmailRequest } from "@/endpointCalls/setEmailFetcher";
    import { emailNotSetDialog } from "@/store";

    let email = $state("");
    let settingEmail = $state(false);
</script>
 
<Dialog.Root bind:open={$emailNotSetDialog}>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Set your Email</Dialog.Title>
            <Dialog.Description>
                You need to set your email if you're planning to select a pricing plan and so we can email you if something goes wrong.<br>
                WARNING! Once you set your email, you CANNOT change it.
            </Dialog.Description>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
            <div class="flex flex-col gap-1">
                <Label for="email" class="text-right">Email Address</Label>
                <Input bind:value={email} id="email" placeholder="example@tailorcal.com" class="col-span-3" />
            </div>
        </div>
        <Dialog.Footer>
            <Button disabled={settingEmail} onclick={async () => {
                settingEmail = true;
                let success = await setEmailRequest(email);
                settingEmail = false;
                if (success) {
                    await invalidateAll();
                    emailNotSetDialog.set(false);
                }
            }}>
                {#if settingEmail}
                    Setting Email
                {:else}
                    Set Email
                {/if}
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>