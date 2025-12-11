import { toast } from "svelte-sonner";

type Success = boolean

export async function createCustomIFeedEvent(
    linkText: string,
    registrationURL: string,
    included: string[],
    showLink: boolean,
    uploadNewEventPicture: File,
): Promise<Success> {
    const data = new FormData();

    data.append("uploadNewEventPicture", uploadNewEventPicture);
    data.append("linkText", linkText);
    data.append("registrationURL", registrationURL);
    data.append("included", JSON.stringify(included));
    data.append("showLink", showLink ? "1" : "0");
    
    const response = await fetch('/api/customIFeedEvent', {
        method: 'POST',
        body: data
    });
    if (response.ok) {
        toast.success(`Successfully uploaded image.`);
        return true;
    } else {
        toast.error(`Failed to upload image.`);
        console.log(response);

        return false;
    }
}