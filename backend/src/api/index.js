import { Router } from "express";
import { addRoutes, generateTreeList } from "../utils/routes";

export default () => {
  const app = Router();

  generateTreeList(__dirname, "routes")
    .then(routes => addRoutes(routes))
    .then(routes => app.use("/", routes));

  return app;
};
