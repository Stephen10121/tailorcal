import { toast } from "svelte-sonner";

type Success = boolean

export async function setEmailRequest(newEmail: string): Promise<Success> {
    const response = await fetch('/api/email', {
        method: 'POST',
        body: JSON.stringify({ email: newEmail }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        toast.success("Successfully updated email.");
        return true;
    } else {
        toast.error("Failed to update email");
        console.log(response);

        return false;
    }
}