import type { ImageFeedCustomizations } from "@/utils";
import { toast } from "svelte-sonner";

type Success = boolean

export async function changeIFeedSettings(
    id: string,
    name: string,
    description: string,
    avatarLink: string,
    uploadedAvatar: File | null,
    displaySettings: ImageFeedCustomizations
): Promise<Success> {
    const data = new FormData();

    if (uploadedAvatar !== null) data.append("newAvatar", uploadedAvatar);
    data.append("id", id);
    data.append("name", name);
    data.append("description", description);
    data.append("avatarLink", avatarLink);
    data.append("displaySettings", JSON.stringify(displaySettings));

    const response = await fetch('/api/imageFeed', {
        method: 'PATCH',
        body: data
    });
    if (response.ok) {
        toast.success("Successfully updated image feed.");
        return true;
    } else {
        toast.error("Failed to update image feed");
        console.log(response);

        return false;
    }
}