import { config } from "dotenv";

config();

export async function load({ parent, locals }) {
    await parent();
} 