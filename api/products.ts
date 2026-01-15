// api/products.ts

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "../src/lib/mongo.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const db = await getDb();

    const products = await db
      .collection("products")
      .find({ isDeleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return res.status(200).json(products);
  } catch (error) {
    console.error("API /products error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
