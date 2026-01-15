// sharity-web/src/server/queryCollection.ts

import type { Document, Filter, Sort, WithId } from "mongodb";
import { getDb } from "@/lib/mongo";

type QueryOptions<T extends Document> = {
  collection: string;
  filter?: Filter<T>;
  sort?: Sort;
  limit?: number;
  projection?: Record<string, 0 | 1>;
};

export const queryCollection = async <T extends Document>({
  collection,
  filter = {} as Filter<T>,
  sort,
  limit = 50,
  projection,
}: QueryOptions<T>): Promise<Array<WithId<T>>> => {
  const db = await getDb();

  let cursor = db.collection<T>(collection).find(filter);

  if (projection) cursor = cursor.project(projection);
  if (sort) cursor = cursor.sort(sort);

  return cursor.limit(limit).toArray();
};
