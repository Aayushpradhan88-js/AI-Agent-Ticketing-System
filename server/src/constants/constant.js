import dotenv from 'dotenv';
dotenv.config();

const serverPORT = process.env.PORT;
const clientURL = process.env.CLIENT_URL;
const sessionSECRET = process.env.SESSION_SECRET;

export { serverPORT, clientURL, sessionSECRET }