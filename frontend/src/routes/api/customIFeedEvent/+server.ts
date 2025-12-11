import type { CustomImageIFeedDBModel, UserModel } from "@/utils";
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

    let customImageIfeed: CustomImageIFeedDBModel | null = null;
    try {
        customImageIfeed = await locals.pb.collection("customImageIfeed").getOne(id.toString(), {
            headers: {
                "Authorization": "Bearer " + process.env.POCKETBASE_TOKEN!
            }
        });
    } catch(err) {
        console.log(err);
        return error(500);
    }

    if (customImageIfeed === null) {
        return error(400, "No user");
    }

    if (customImageIfeed.owner !== locals.user.id) {
        return error(401, "Invalid Request.");
    }

    try {
        await locals.pb.collection('customImageIfeed').delete(customImageIfeed.id, {
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
    const eventPictureLink = formData.get("eventPictureLink");
    const registrationURL = formData.get("registrationURL");
    const included = formData.get("included");
    const linkText = formData.get("linkText");
    const showLink = formData.get("showLink");
    const uploadNewEventPicture = formData.get("uploadNewEventPicture");

    const showLinkBool = showLink?.toString() === "1";

    if (id == null || eventPictureLink == null || included === null || (showLinkBool && (linkText === null || registrationURL === null))) {
        return error(400, "Missing Data.");
    }

    let parsedIncludedIfeeds: string[];
    try {
        parsedIncludedIfeeds = JSON.parse(included.toString());
    } catch (_) {
        return error(400, "Missing Data.");
    }

    let customImageIfeed: CustomImageIFeedDBModel | null = null;
    try {
        customImageIfeed = await locals.pb.collection("customImageIfeed").getOne(id.toString(), {
            headers: {
                "Authorization": "Bearer " + process.env.POCKETBASE_TOKEN!
            }
        });
    } catch(err) {
        console.log(err);
        return error(500);
    }

    if (customImageIfeed === null) {
        return error(400, "No user");
    }

    if (customImageIfeed.owner !== locals.user.id) {
        return error(401, "Invalid Request.");
    }
    
    try {
        let data: Partial<CustomImageIFeedDBModel> = {
            "linkText": linkText?.toString(),
            "registrationURL": registrationURL?.toString(),
            "showLink": showLinkBool,
            "imageFeed": parsedIncludedIfeeds,
        };
        
        if (uploadNewEventPicture !== null) {
            //@ts-ignore
            data["picture"] = uploadNewEventPicture;
        }

        await locals.pb.collection('customImageIfeed').update(customImageIfeed.id, data, {
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

    const linkText = formData.get("linkText");
    const registrationURL = formData.get("registrationURL");
    const included = formData.get("included");
    const showLink = formData.get("showLink");
    const uploadNewEventPicture = formData.get("uploadNewEventPicture");

    const showLinkBool = showLink?.toString() === "1";

    if ((showLinkBool && (linkText === null || registrationURL === null)) || uploadNewEventPicture === null || included === null) {
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
        let data: Partial<CustomImageIFeedDBModel> = {
            "linkText": linkText?.toString(),
            "registrationURL": registrationURL?.toString(),
            "showLink": showLinkBool,
            "imageFeed": parsedIncludedIfeeds,
            "owner": locals.user.id
        };

        //@ts-ignore
        data["picture"] = uploadNewEventPicture;

        await locals.pb.collection('customImageIfeed').create(data, {
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