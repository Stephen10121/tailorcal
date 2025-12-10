import { toast } from "svelte-sonner";

type Success = boolean

export async function deleteCustomIFeedEvent(id: string): Promise<Success> {
    const data = new FormData();

    data.append("id", id);

    const response = await fetch('/api/customIFeedEvent', {
        method: 'DELETE',
        body: data
    });
    if (response.ok) {
        toast.success("Successfully deleted event.");
        return true;
    } else {
        toast.error("Failed to delete event!");
        console.log(response);

        return false;
    }
}