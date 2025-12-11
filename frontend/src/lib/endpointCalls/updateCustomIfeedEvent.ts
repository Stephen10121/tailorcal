import type { ImageFeedCustomizations, ImageFeedFilters } from "@/utils";
import { toast } from "svelte-sonner";

type Success = boolean

export async function updateCustomIFeedEvent(
    id: string,
    linkText: string,
    registrationURL: string,
    included: string[],
    showLink: boolean,
    uploadNewEventPicture: File | null,
    eventPictureLink: string,
): Promise<Success> {
    const data = new FormData();

    if (uploadNewEventPicture !== null) data.append("uploadNewEventPicture", uploadNewEventPicture);
    data.append("id", id);
    data.append("linkText", linkText);
    data.append("eventPictureLink", eventPictureLink);
    data.append("registrationURL", registrationURL);
    data.append("included", JSON.stringify(included));
    data.append("showLink", showLink ? "1" : "0");
    
    const response = await fetch('/api/customIFeedEvent', {
        method: 'PATCH',
        body: data
    });
    if (response.ok) {
        toast.success(`Successfully updated image.`);
        return true;
    } else {
        toast.error(`Failed to update image.`);
        console.log(response);

        return false;
    }
}