import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const SERVER_PORT = parseInt(process.env.PORT || '3000', 10);
const CLIENT_URL = process.env.CLIENT_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_TOKEN_EXPIRY_DATE = process.env.JWT_TOKEN_EXPIRY_DATE;
const SESSION_SECRET = process.env.SESSION_SECRET;
const MAILTRAP_SMTP_HOST = process.env.MAILTRAP_SMTP_HOST;
const MAILTRAP_SMTP_PORT = process.env.MAILTRAP_SMTP_PORT;
const MAILTRAP_SMTP_USER = process.env.MAILTRAP_SMTP_USER;
const MAILTRAP_SMTP_PASS = process.env.MAILTRAP_SMTP_PASS;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const INNGEST_EVENT_KEY = process.env.INNGEST_EVENT_KEY;
const INNGEST_SIGNING_KEY = process.env.INNGEST_SIGNING_KEY;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error(`secret length must be at least ${JWT_SECRET.length}`);
}

if (!CLIENT_URL.startsWith('http')) {
    throw new Error(`invalid client URL: ${CLIENT_URL}`);
}

export {
    MONGO_URI,
    SERVER_PORT, CLIENT_URL,
    JWT_SECRET, JWT_TOKEN_EXPIRY_DATE, SESSION_SECRET,
    MAILTRAP_SMTP_HOST, MAILTRAP_SMTP_PORT, MAILTRAP_SMTP_USER, MAILTRAP_SMTP_PASS,
    GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
    INNGEST_EVENT_KEY, INNGEST_SIGNING_KEY, GEMINI_API_KEY
}