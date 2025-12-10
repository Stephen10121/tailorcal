import { toast } from "svelte-sonner";

type Success = boolean

export async function createCustomIFeedEvent(
    name: string,
    description: string,
    registrationURL: string,
    dateValue: number,
    included: string[],
    show: boolean,
    uploadNewEventPicture: File,
): Promise<Success> {
    const data = new FormData();

    data.append("uploadNewEventPicture", uploadNewEventPicture);
    data.append("name", name);
    data.append("description", description);
    data.append("registrationURL", registrationURL);
    data.append("dateValue", dateValue.toString());
    data.append("included", JSON.stringify(included));
    data.append("show", show ? "1" : "0");
    
    const response = await fetch('/api/customIFeedEvent', {
        method: 'POST',
        body: data
    });
    if (response.ok) {
        toast.success(`Successfully created "${name}"`);
        return true;
    } else {
        toast.error(`Failed to create "${name}"`);
        console.log(response);

        return false;
    }
}