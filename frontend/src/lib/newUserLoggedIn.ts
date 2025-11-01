import { config } from "dotenv";

config();

export async function newUserLoggedIn(userId: string, refreshToken: string) {
    try {
        // Send a user subscribed message to the backend to start getting the data to populate the calendar.
        const newUserResp = await fetch(`${process.env.PB_URL}newUser`, {
            method: "POST",
            body: JSON.stringify({
                "id": userId,
                "refreshToken": refreshToken
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (newUserResp.ok) {
            const newUserRespJSON = await newUserResp.json();
            console.log(newUserRespJSON);
            return true;
        } else {
            console.log(newUserResp);

            return false;
        }
    } catch (err) {
        console.log("newuserpost error", err);

        return false;
    }
}