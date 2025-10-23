import { config } from "dotenv";

config();

export async function userHasSubscribed(userId: string, refreshToken: string) {
    console.log(`${process.env.PB_URL}/userSubscribed`);
    try {
        // Send a user subscribed message to the backend to start getting the data to populate the calendar.
        const userSubscribedResp = await fetch(`${process.env.PB_URL}userSubscribed`, {
            method: "POST",
            body: JSON.stringify({
                "id": userId,
                "refreshToken": refreshToken
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (userSubscribedResp.ok) {
            const userSubscribedRespJSON = await userSubscribedResp.json();
            console.log(userSubscribedRespJSON);
            return true;
        } else {
            console.log(userSubscribedResp);

            return false;
        }
    } catch (err) {
        console.log("usersubscribedpost error", err);

        return false;
    }
}