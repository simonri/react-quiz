import express from "express";
import path from "path";

import fs from "fs-extra";

let globalRoutePath = [];
export const addRoutes = items => {
	const expressRouter = express.Router();

	for (const [routePath, currentRoute] of Object.entries(items)) {
		if (currentRoute.type === "directory") {
			globalRoutePath.push(routePath);
			expressRouter.use(
				`/${routePath}`,
				addRoutes(currentRoute.items, false)
			);
			globalRoutePath = globalRoutePath.slice(0, -1);
		} else if (currentRoute.type === "file") {
			let [routeName, routeMethod] = routePath.split(".");
			if (routeName === "index") routeName = "";
			expressRouter[routeMethod](
				"/" + routeName,
				require(path.join(currentRoute.dir, routePath)).default
			);
		} else {
			throw new Error("Invalid type!");
		}
	}
	return expressRouter;
};

export const generateTreeList = async (...ofFolder) => {
	let structure = {};
	const dir = await fs.readdir(path.join(...ofFolder));

	for (const item of dir) {
		const stat = await fs.stat(path.join(...ofFolder, item));

		if (stat.isDirectory()) {
			const newItem = await generateTreeList(...ofFolder, item);
			structure[item] = {
				type: "directory",
				items: newItem,
				dir: ofFolder
			};
		} else {
			structure[item] = {
				type: "file",
				dir: path.join(...ofFolder)
			};
		}
	}
	return structure;
};
