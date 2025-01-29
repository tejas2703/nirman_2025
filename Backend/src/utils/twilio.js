import twilio from "twilio";
import {ApiError} from "./ApiError.js";

const TWILIO_ACCOUNT_SID = 'ACede0c0f86268722bc97d2b3ad5a520c8';
const TWILIO_AUTH_TOKEN = 'd11e190a5527a2cbbc5e0d6ee1328f6e';
const TWILIO_PHONE_NUMBER = '+18454069559';

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
