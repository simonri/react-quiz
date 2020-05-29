import mongoose from "mongoose";
import config from "./config";

mongoose.Promise = global.Promise;

export const connect = async () => {
  try {
    let connection = await mongoose.connect(config.db.url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    });

    console.log("MongoDB connected");
    return connection;
  } catch (err) {
    console.log(err);
    console.log(`Connection failed with config ${config.db.url}`);
    process.exit(1);
  }
};
