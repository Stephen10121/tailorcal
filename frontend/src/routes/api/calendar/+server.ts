import { error, json } from "@sveltejs/kit";
import { config } from "dotenv";
import type { RecordModel } from "pocketbase";

config();

export async function PATCH({ locals, request }) {
    if (!locals.user) return error(401, "No user");

    const formData = await request.formData();

    const id = formData.get("id");
    const name = formData.get("name");
    const description = formData.get("description");
    const enablePassword = formData.get("enablePassword");
    const newPassword = formData.get("newPassword");
    const avatarLink = formData.get("avatarLink");
    const newAvatar = formData.get("newAvatar");

    if (id == null || name == null || description == null || enablePassword == null || newPassword == null || avatarLink == null) {
        return error(400, "Missing Data.");
    }

    let calendar: RecordModel | null = null;
    try {
        calendar = await locals.pb.collection("calendars").getOne(id.toString(), {
            headers: {
                "Authorization": "Bearer " + process.env.POCKETBASE_TOKEN!
            }
        });
    } catch(err) {
        console.log(err);
        return error(500);
    }

    if (calendar === null) {
        return error(400, "No user");
    }

    if (calendar.owner !== locals.user.id) {
        return error(401, "No user");
    }

    try {
        let data: {[key:string]: any} = {
            "name": name.toString(),
            "description": description.toString(),
            "passwordEnabled": enablePassword.toString() === "1",
        };

        if (newPassword.toString().length > 0 && enablePassword.toString() === "1") {
            data["password"] = newPassword.toString();
        }

        if (avatarLink.toString().length === 0) {
            data["logo"] = newAvatar;
        }

        await locals.pb.collection('calendars').update(calendar.id, data, {
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