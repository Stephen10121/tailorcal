import { error, json } from "@sveltejs/kit";
import Stripe from "stripe";
import { config } from "dotenv";
import { userHasSubscribed } from "@/userSubscribed.js";

config();

export async function POST({ request, locals }) {
    console.log("[server] Someone just subscribed to a plan.");
    if (!process.env.STRIPE_PRIVATE_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
        console.error("STRIPE_PRIVATE_KEY or STRIPE_WEBHOOK_SECRET env var is not set.");
        return json({msg: "not ok"}, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || "";

    let event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error(`Webhook signature verification failed. ${err}`);
        return json({ error: err }, { status: 400 });
    }

    const data = event.data;
    const eventType = event.type;

    try {
        switch (eventType) {
            case "checkout.session.completed":
            case "customer.subscription.updated": {
                //@ts-ignore
                const session = await stripe.checkout.sessions.retrieve(data.object.id, {
                    expand: ['line_items']
                });

                const customerId = session?.customer as string;
                const customer = await stripe.customers.retrieve(customerId);

                const priceId = process.env.STRIPE_PRICE_ID;

                //@ts-ignore
                const user = await locals.pb.collection('users').getFirstListItem(`email="${customer.email}"`, {
                    headers: {
                        "Authorization": "Bearer " + process.env.POCKETBASE_TOKEN!
                    }
                });

                await locals.pb.collection('users').update(user.id, {
                    priceId,
                    accessLevel: "standard",
                    customerId
                }, {
                    headers: {
                        "Authorization": "Bearer " + process.env.POCKETBASE_TOKEN!
                    }
                });

                // Tells the backend that the user has subscribed.
                await userHasSubscribed(user.id);

                break
            }
        case "customer.subscription.deleted": {
            //@ts-ignore
            const subscription = await stripe.subscriptions.retrieve(data.object.id);

            const user = await locals.pb.collection('users').getFirstListItem(`customerId="${subscription.customer}"`, {
                headers: {
                    "Authorization": "Bearer " + process.env.POCKETBASE_TOKEN!
                }
            });

            console.log(user.name, "is deleting their subscription.");

            await locals.pb.collection('users').update(user.id, {
                accessLevel: "none",
            }, {
                headers: {
                    "Authorization": "Bearer " + process.env.POCKETBASE_TOKEN!
                }
            });

            break
        }
        }
    } catch (err) {
        console.log("[server] Error in the user subscription endpoint.", err);

        return error(500);
    }

    return json({msg: "ok"});
}