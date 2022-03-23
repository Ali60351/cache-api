import mongoose from "mongoose";
import { DATABASE_URL } from "./config";

var db = mongoose.connection;

if (db.readyState !== 1) {
  var mongoDB = DATABASE_URL as string;
  mongoose.connect(mongoDB);

  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}
