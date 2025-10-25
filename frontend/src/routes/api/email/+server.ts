import { error, json } from "@sveltejs/kit";
import { config } from "dotenv";

config();

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export async function POST({ locals, request }) {
    if (!locals.user) return error(401, "No user");

    const { email } = await request.json();

    if (!validateEmail(email)) {
        return error(422, "Invalid Email Address.");
    }

    try {
        const user = await locals.pb.collection("users").getOne(locals.user.id, {
            headers: {
                "Authorization": "Bearer " + process.env.POCKETBASE_TOKEN!
            }
        });

        if (user.userEmail) {
            return error(409, "Email already set.");
        }

        await locals.pb.collection('users').update(user.id, {
            userEmail: email,
        }, {
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