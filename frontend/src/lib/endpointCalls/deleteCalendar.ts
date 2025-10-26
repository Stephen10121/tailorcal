import { toast } from "svelte-sonner";

type Success = boolean

export async function deleteCalendar(id: string): Promise<Success> {
    const data = new FormData();

    data.append("id", id);

    const response = await fetch('/api/calendar', {
        method: 'DELETE',
        body: data
    });
    if (response.ok) {
        toast.success("Successfully deleted calendar.");
        return true;
    } else {
        toast.error("Failed to deleted calendar");
        console.log(response);

        return false;
    }
}