import mongoose from "mongoose";
import { DATABASE_URL } from "./config";

var mongoDB = DATABASE_URL as string;
mongoose.connect(mongoDB);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
