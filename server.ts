import app from "./src/app";
import http from "http";

const port = process.env.PORT || "3000";
const server = http.createServer(app);

server.listen(port, () => console.log(`Core Service listening on port ${port}`));
server.on("error", (err) => console.error(err));
