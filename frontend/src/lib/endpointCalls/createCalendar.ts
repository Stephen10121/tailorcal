import { goto } from "$app/navigation";
import { emailNotSetDialog } from "@/store";
import { toast } from "svelte-sonner";

type Success = boolean

export async function createCalendar(
    name: string,
    description: string,
    enablePassword: boolean,
    newPassword: string,
    stripeUrl: string,
    userEmail: any
): Promise<Success> {
    const data = new FormData();

    data.append("name", name);
    data.append("description", description);
    data.append("enablePassword", enablePassword ? "1" : "0");
    data.append("newPassword", newPassword);

    const response = await fetch('/api/calendar', {
        method: 'POST',
        body: data
    });
    if (response.ok) {
        toast.success("Successfully created calendar.");
        return true;
    } else {
        if (response.status === 402) {
            toast("Calendar limit reached.", {
                description: "Subscribe to a plan to get more features.",
                action: {
                    label: "Subscribe",
                    onClick: () => {
                        if (userEmail) {
                            window.location.replace(stripeUrl + "?prefilled_email=" + userEmail);
                        } else {
                            emailNotSetDialog.set(true);
                        }
                    }
                }
            });
        } else {
            toast.error("Failed to create calendar");
        }
        console.log({response});

        return false;
    }
}