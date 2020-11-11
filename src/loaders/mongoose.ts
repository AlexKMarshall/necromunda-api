import mongoose from "mongoose";
import { databaseUrl } from "../config";

const defaultMongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

type LoaderProps = {
  databaseUrl: string;
  mongooseOptions?: typeof defaultMongooseOptions;
};

const loader = async ({
  databaseUrl,
  mongooseOptions = defaultMongooseOptions,
}: LoaderProps) => {
  const connection = await mongoose.connect(databaseUrl, mongooseOptions);
};

export default loader;
