import { redirect } from '@sveltejs/kit';

export async function load({ parent }) {
    const data = await parent();

    if (!data.user) {
        return redirect(301, "/");
    }

    return {
        ...data
    }
} 