import type { EventDBModel, ImageFeedDBModel } from "@/utils";
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

    const now = Date.now();

    let events: EventDBModel[] = [];
    try {
        let filter = "";
        if (imageFeed.id === "v7t0bmf8o0rqx5b") {
            filter = `startTime >= ${now}`;
        } else {
            filter = `owner="${imageFeed.owner}" && startTime >= ${now}`;
        }
        let newEvents: EventDBModel[] = await locals.pb.collection('events').getFullList({
            filter,
            sort: 'startTime',
            headers: {
                "Authorization": "Bearer " + process.env.POCKETBASE_TOKEN!
            }
        });

        for (let i=0;i<newEvents.length;i++) {
            const { owner, ...rest } = newEvents[i];
            if (newEvents[i].imageURL.length > 0) {
                if (imageFeed.filters.hideUnpublished && !rest.visibleInChurchCenter) continue
                if (imageFeed.filters.onlyShowFeatured && !rest.featured) continue
                events.push(rest as EventDBModel);
            }
        }

    } catch (err) {
        console.log("Events not found.");
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