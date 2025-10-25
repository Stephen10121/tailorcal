import { redirect } from '@sveltejs/kit';
import type { RecordModel } from 'pocketbase';

export async function load({ params, parent }) {
    const data = await parent();
    let slug = params.slug;

    let selectedCalendar: RecordModel | null = null;
    for (let i=0;i<data.calendars.length;i++) {
        if (data.calendars[i].id === slug) {
            selectedCalendar = data.calendars[i];
        }
    }

    if (!selectedCalendar) {
        return redirect(301, "/dashboard/calendars");
    }

    return {
        selectedCalendar
    }
}