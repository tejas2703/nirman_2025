import twilio from "twilio";
import {ApiError} from "./ApiError.js";
import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export const sendTwilioAlert = async (to, message) => {
    try {
        if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
            console.error("Twilio credentials are missing!");           
        }
        const response = await client.messages.create({
            body: message,
            from: TWILIO_PHONE_NUMBER,
            to,
        });
        console.log("Twilio message sent:", response.sid);
        return response.sid;
    } catch (error) {
        console.error("Twilio error:", error.message);
        throw new ApiError("Failed to send SMS alert");
    }
};
