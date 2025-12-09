import type { ImageFeedCustomizations, ImageFeedFilters } from "@/utils";
import { toast } from "svelte-sonner";

type Success = boolean

export async function updateCustomIFeedEvent(
    id: string,
    name: string,
    description: string,
    registrationURL: string,
    dateValue: number,
    included: string[],
    show: boolean,
    uploadNewEventPicture: File | null,
    eventPictureLink: string,
): Promise<Success> {
    const data = new FormData();

    if (uploadNewEventPicture !== null) data.append("uploadNewEventPicture", uploadNewEventPicture);
    data.append("id", id);
    data.append("name", name);
    data.append("description", description);
    data.append("eventPictureLink", eventPictureLink);
    data.append("registrationURL", registrationURL);
    data.append("dateValue", dateValue.toString());
    data.append("included", JSON.stringify(included));
    data.append("show", show ? "1" : "0");
    
    const response = await fetch('/api/customIFeedEvent', {
        method: 'PATCH',
        body: data
    });
    if (response.ok) {
        toast.success(`Successfully updated "${name}"`);
        return true;
    } else {
        toast.error(`Failed to update "${name}"`);
        console.log(response);

        return false;
    }
}