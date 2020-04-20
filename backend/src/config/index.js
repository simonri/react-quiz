import dotenv from "dotenv";
dotenv.config();

export default {
	port: "80",
	logs: "silly",
	api: "https://opentdb.com/api.php",
	databaseURL:
		"mongodb+srv://simon:<password>@cluster0-j08lp.mongodb.net/test"
};
