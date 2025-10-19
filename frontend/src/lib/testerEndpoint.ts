import { config } from "dotenv";

config();

export async function testerEndpoint(userId: string) {
    console.log(`${process.env.PB_URL}/tester`);
    try {
        const userSubscribedResp = await fetch(`${process.env.PB_URL}tester`, {
            method: "POST",
            body: JSON.stringify({
                "id": userId
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (userSubscribedResp.ok) {
            const userSubscribedRespJSON = await userSubscribedResp.json();
            return userSubscribedRespJSON;
        } else {
            console.log(userSubscribedResp);

            return false;
        }
    } catch (err) {
        console.log("usersubscribedpost error", err);

        return false;
    }
}