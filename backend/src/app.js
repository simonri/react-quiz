import express from "express";
import config from "./config";
import loaders from "./loaders";

async function startServer() {
  const app = express();
  loaders({ expressApp: app });

  app.listen(config.port, err => {
    if (err) {
      app.locals.logger.error(err);
      process.exit(1);
    }

    app.locals.logger.info(`Express running on port: ${config.port}`);
  });
}

startServer();
