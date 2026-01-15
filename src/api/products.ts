// src/api/products.ts

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { queryCollection } from "@/server/queryCollection";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const products = await queryCollection({
    collection: "products",
    filter: { isDeleted: { $ne: true } },
    sort: { createdAt: -1 },
    limit: 50,
  });

  return res.status(200).json(products);
}
