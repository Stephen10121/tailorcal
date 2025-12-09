import type { CustomEventIFeedDBModel } from "@/utils";
import { error, json } from "@sveltejs/kit";
import { config } from "dotenv";

config();

export async function PATCH({ locals, request }) {
    if (!locals.user) return error(401, "No user");

    const formData = await request.formData();

    const id = formData.get("id");
    const name = formData.get("name");
    const description = formData.get("description");
    const eventPictureLink = formData.get("eventPictureLink");
    const registrationURL = formData.get("registrationURL");
    const dateValue = formData.get("dateValue");
    const included = formData.get("included");
    const show = formData.get("show");
    const uploadNewEventPicture = formData.get("uploadNewEventPicture");

    if (id == null || name == null || description == null || eventPictureLink == null || dateValue === null || included === null) {
        return error(400, "Missing Data.");
    }

    let parsedIncludedIfeeds: string[];
    try {
        parsedIncludedIfeeds = JSON.parse(included.toString());
    } catch (_) {
        return error(400, "Missing Data.");
    }

    let imageFeed: CustomEventIFeedDBModel | null = null;
    try {
        imageFeed = await locals.pb.collection("customEventsIfeed").getOne(id.toString(), {
            headers: {
                "Authorization": "Bearer " + process.env.POCKETBASE_TOKEN!
            }
        });
    } catch(err) {
        console.log(err);
        return error(500);
    }

    if (imageFeed === null) {
        return error(400, "No user");
    }

    if (imageFeed.owner !== locals.user.id) {
        return error(401, "Invalid Request.");
    }
    
    try {
        let data: Partial<CustomEventIFeedDBModel> = {
            "name": name.toString(),
            "description": description.toString(),
            "registrationURL": registrationURL?.toString(),
            "show": show?.toString() === "1",
            "imageFeed": parsedIncludedIfeeds,
            "date": (new Date(parseInt(dateValue.toString()))).toISOString()
        };
        
        if (uploadNewEventPicture !== null) {
            //@ts-ignore
            data["picture"] = uploadNewEventPicture;
        }

        await locals.pb.collection('customEventsIfeed').update(imageFeed.id, data, {
            headers: {
                "Authorization": "Bearer " + process.env.POCKETBASE_TOKEN!
            }
        });
    } catch (err) {
        console.log(err);

        return error(500);
    }

    return json({msg: "ok"});
}