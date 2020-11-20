import mongoose from "mongoose";

export async function connectMongoose() {
  jest.setTimeout(20000);
  return mongoose.connect(
    `mongodb://localhost:27017/necro-${process.env.JEST_WORKER_ID}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
}

export async function clearDatabase() {
  await mongoose.connection.db.dropDatabase();
}

export async function disconnectMongoose() {
  await mongoose.disconnect();
  mongoose.connections.forEach((connection) => {
    const modelNames = Object.keys(connection.models);

    modelNames.forEach((modelName) => {
      delete connection.models[modelName];
    });

    const collectionNames = Object.keys(connection.collections);
    collectionNames.forEach((collectionName) => {
      delete connection.collections[collectionName];
    });
  });
}
