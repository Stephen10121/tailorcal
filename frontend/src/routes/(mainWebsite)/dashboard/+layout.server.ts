import { redirect } from '@sveltejs/kit';
import type { RecordModel } from 'pocketbase';

export async function load({ parent, locals }) {
    const data = await parent();

    if (!data.user) {
        return redirect(301, "/");
    }

    let calendars: RecordModel[] = [];
    try {
        calendars = await locals.pb.collection('calendars').getFullList({
            filter: `owner="${data.user.id}"`,
            headers: {
                "Authorization": "Bearer " + process.env.POCKETBASE_TOKEN!
            }
        });
    } catch (err) {
        console.log("Failed to fetch calendars.", err);
    }

    return {
        ...data,
        pb_url: process.env.PB_URL!,
        calendars
    }
} 