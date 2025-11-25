import type { EventDBModel, ImageFeedDBModel, RestrictedEventDBModel } from "@/utils";
import { error } from "@sveltejs/kit";
import { config } from "dotenv";

config();

export async function load({ params, locals }) {
    let imageFeed: ImageFeedDBModel;
    try {
        imageFeed = await locals.pb.collection('imageFeeds').getOne(params.slug, {
            headers: {
                "Authorization": "Bearer " + process.env.POCKETBASE_TOKEN!
            }
        });
    } catch (err) {
        console.log("Image Feed not found.", err);
        return error(404, "Image Feed Not Found");
    }

    const today = new Date();
    const now = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;

    let events: RestrictedEventDBModel[] = [];
    try {
        let filter = `startTime >= "${now}" && imageURL != ""`;

        // This filter shows all events for the testing dev feed.
        if (imageFeed.id !== "v7t0bmf8o0rqx5b") {
            filter += ` && owner="${imageFeed.owner}"`;
        }

        if (imageFeed.filters.onlyShowFeatured) {
            filter += " && featured=true"
        }

        if (imageFeed.filters.hideUnpublished) {
            filter += " && visibleInChurchCenter=true"
        }

        events = await locals.pb.collection('events').getFullList({
            filter,
            sort: 'startTime',
            fields: "id,name,description,imageURL,registrationURL,location,startTime,endTime,featured,visibleInChurchCenter,created,updated",
            headers: {
                "Authorization": "Bearer " + process.env.POCKETBASE_TOKEN!
            }
        });

        console.log(events);
    } catch (err) {
        console.log("Events not found.", err);
        return error(500, "Internal Server error.");
    }

    try {
        await locals.pb.collection('imageFeeds').update(imageFeed.id, { 
            visits: imageFeed.visits + 1
        }, {
            headers: {
                "Authorization": "Bearer " + process.env.POCKETBASE_TOKEN!
            }
        });
    } catch (err) {
        console.log("Failed to update the visits for image feeds", err);
        return error(500);
    }

    return {
        events,
        name: imageFeed.name,
        logoLink: locals.pb.files.getURL(imageFeed, imageFeed.logo),
        displaySettings: imageFeed.displaySettings,
        description: imageFeed.description
    }
}