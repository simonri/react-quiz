import mongoose from "mongoose";
import config from "../config";

module.exports = async () => {
  const connection = await mongoose.connect(config.databaseURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
  return connection.connection.db;
};
