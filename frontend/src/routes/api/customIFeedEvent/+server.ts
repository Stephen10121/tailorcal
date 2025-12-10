import type { CustomEventIFeedDBModel, UserModel } from "@/utils";
import { error, json } from "@sveltejs/kit";
import { config } from "dotenv";

config();

export async function DELETE({ locals, request }) {
    if (!locals.user) return error(401, "No user");

    const formData = await request.formData();

    const id = formData.get("id");

    if (id === null) {
        return error(400, "Missing Data.");
    }

    let customEventsIfeed: CustomEventIFeedDBModel | null = null;
    try {
        customEventsIfeed = await locals.pb.collection("customEventsIfeed").getOne(id.toString(), {
            headers: {
                "Authorization": "Bearer " + process.env.POCKETBASE_TOKEN!
            }
        });
    } catch(err) {
        console.log(err);
        return error(500);
    }

    if (customEventsIfeed === null) {
        return error(400, "No user");
    }

    if (customEventsIfeed.owner !== locals.user.id) {
        return error(401, "Invalid Request.");
    }

    try {
        await locals.pb.collection('customEventsIfeed').delete(customEventsIfeed.id, {
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

    let customEventsIfeed: CustomEventIFeedDBModel | null = null;
    try {
        customEventsIfeed = await locals.pb.collection("customEventsIfeed").getOne(id.toString(), {
            headers: {
                "Authorization": "Bearer " + process.env.POCKETBASE_TOKEN!
            }
        });
    } catch(err) {
        console.log(err);
        return error(500);
    }

    if (customEventsIfeed === null) {
        return error(400, "No user");
    }

    if (customEventsIfeed.owner !== locals.user.id) {
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

        await locals.pb.collection('customEventsIfeed').update(customEventsIfeed.id, data, {
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

export async function POST({ locals, request }) {
    if (!locals.user) return error(401, "No user");

    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const registrationURL = formData.get("registrationURL");
    const dateValue = formData.get("dateValue");
    const included = formData.get("included");
    const show = formData.get("show");
    const uploadNewEventPicture = formData.get("uploadNewEventPicture");

    if (name == null || description == null || dateValue === null || included === null || uploadNewEventPicture === null) {
        return error(400, "Missing Data.");
    }

    let parsedIncludedIfeeds: string[];
    try {
        parsedIncludedIfeeds = JSON.parse(included.toString());
    } catch (_) {
        return error(400, "Missing Data.");
    }

    let user: UserModel | null = null;
    try {
        user = await locals.pb.collection("users").getOne(locals.user.id, {
            headers: {
                "Authorization": "Bearer " + process.env.POCKETBASE_TOKEN!
            }
        });
    } catch (err) {
        console.log(err);

        return error(401, "No user");
    }

    if (!user) {
        return error(401, "No user");
    }

    try {
        let data: Partial<CustomEventIFeedDBModel> = {
            "name": name.toString(),
            "description": description.toString(),
            "registrationURL": registrationURL?.toString(),
            "show": show?.toString() === "1",
            "imageFeed": parsedIncludedIfeeds,
            "date": (new Date(parseInt(dateValue.toString()))).toISOString(),
            "owner": locals.user.id
        };

        //@ts-ignore
        data["picture"] = uploadNewEventPicture;

        await locals.pb.collection('customEventsIfeed').create(data, {
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