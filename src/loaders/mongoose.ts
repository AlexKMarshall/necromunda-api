import mongoose from "mongoose";

const defaultMongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

type LoaderProps = {
  databaseUrl?: string;
  mongooseOptions?: typeof defaultMongooseOptions;
};

const loader = async ({
  databaseUrl = process.env.DATABASE_URI || "",
  mongooseOptions = defaultMongooseOptions,
}: LoaderProps = {}) => {
  console.log(databaseUrl);
  await mongoose.connect(databaseUrl, mongooseOptions);
};

export default loader;
