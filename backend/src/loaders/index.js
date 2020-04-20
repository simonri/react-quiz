import expressLoader from "./express";
import mongooseLoader from "./mongoose";
import Logger from "./logger";

export default async ({ expressApp }) => {
	expressLoader({ app: expressApp });
	expressApp.locals.logger = Logger;
	Logger.info("Express loaded");

	await mongooseLoader();
	Logger.info("Connected to database");
};
