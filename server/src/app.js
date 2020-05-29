import { createServer } from "http";
import { connect } from "./db";
import config from "./config";
import app from "./server";

const server = createServer(app);
connect();

server.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
