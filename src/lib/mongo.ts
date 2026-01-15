// sharity-web/src/lib/mongo.ts

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error("Missing MONGODB_URI");
}

if (!dbName) {
  throw new Error("Missing MONGODB_DB");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const clientPromise =
  global._mongoClientPromise ??
  (() => {
    const client = new MongoClient(uri);
    const promise = client.connect();
    global._mongoClientPromise = promise;
    return promise;
  })();

export const getDb = async () => {
  const client = await clientPromise;
  return client.db(dbName);
};
