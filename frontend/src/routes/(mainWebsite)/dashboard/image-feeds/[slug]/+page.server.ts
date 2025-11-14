import type { CalendarDBModel, ImageFeedDBModel } from '@/utils.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params, parent }) {
    const data = await parent();
    let slug = params.slug;

    let selectedfeed: ImageFeedDBModel | null = null;
    for (let i=0;i<data.imageFeeds.length;i++) {
        if (data.imageFeeds[i].id === slug) {
            selectedfeed = data.imageFeeds[i];
        }
    }

    if (!selectedfeed) {
        return redirect(301, "/dashboard/image-feeds");
    }

    return {
        selectedfeed
    }
}