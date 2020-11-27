import mongoose from "mongoose";
import mongooseLoader from "../loaders/mongoose";

export async function connectMongoose() {
  jest.setTimeout(20000);
  await mongooseLoader();
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
