import { testerEndpoint } from "@/testerEndpoint.js";
import { userHasSubscribed } from "@/userSubscribed";
import { error, json } from "@sveltejs/kit";

export async function GET({ locals, url }) {
    console.log("Test Hit.");
    const scope = url.searchParams.get("scope");

    if (locals.user) {
        try {
            const user = await locals.pb.collection("users").getOne(locals.user.id, {
                headers: {
                    "Authorization": "Bearer " + process.env.POCKETBASE_TOKEN!
                }
            });
            
            if (scope === "newAccessToken") {
                await userHasSubscribed(user.id);
            } else if (scope === "compareExp") {
                let res = await testerEndpoint(user.id);
                return json({ msg: res});
            }

        } catch (err) {
            console.log(err);

            return error(500);
        }
    } else {
        return error(401, "No user");
    }

    return json({msg: "ok"});
}