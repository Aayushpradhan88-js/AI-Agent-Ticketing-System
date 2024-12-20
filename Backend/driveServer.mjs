import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import app from "./driveApp.mjs";

dotenv.config();
cors();

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

