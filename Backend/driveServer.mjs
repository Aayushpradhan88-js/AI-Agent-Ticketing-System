import http from "http";
import app from "./driveApp.mjs";
const PORT= process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
