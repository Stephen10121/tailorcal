import type { EventDBModel, EventDBModelPrivate } from "@/utils";
import { error, redirect } from "@sveltejs/kit";
import { config } from "dotenv";
import type { RecordModel } from "pocketbase";

config();

export async function load({ params, locals, cookies }) {
    let calendar: RecordModel;
    try {
        calendar = await locals.pb.collection('calendars').getOne(params.slug, {
            headers: {
                "Authorization": "Bearer " + process.env.POCKETBASE_TOKEN!
            }
        });
    } catch (err) {
        console.log("Calendar not found.", err);
        return error(404, "Calendar Not Found");
    }

    if (calendar.password) {
        if (cookies.get(`cal-${params.slug}`) !== calendar.password) {
            return redirect(301, `/cal/${params.slug}/login`);
        }
    }

    const seventyTwoHoursAgo = Date.now() - (72 * 60 * 60 * 1000);

    let events: EventDBModel[] = [];
    try {
        let newEvents = await locals.pb.collection('events').getFullList({
            filter: `owner="${calendar.owner}" && startTime >= ${seventyTwoHoursAgo}`,
            sort: 'startTime',
            headers: {
                "Authorization": "Bearer " + process.env.POCKETBASE_TOKEN!
            }
        });

        for (let i=0;i<newEvents.length;i++) {
            const { owner, ...rest } = newEvents[i];
            events.push(rest as EventDBModel);
        }

    } catch (err) {
        console.log("Calendar not found.");
        return error(500, "Internal Server error.");
    }

    try {
        await locals.pb.collection('calendars').update(calendar.id, { 
            visits: calendar.visits + 1
        }, {
            headers: {
                "Authorization": "Bearer " + process.env.POCKETBASE_TOKEN!
            }
        });
    } catch (err) {
        console.log("Failed to update the visits", err);
        return error(500);
    }

    return {
        events,
        name: calendar.name,
        logoLink: locals.pb.files.getURL(calendar, calendar.logo),
    }
}