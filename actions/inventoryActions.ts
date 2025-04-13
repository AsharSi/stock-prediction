"use server";
import { createConnection } from "@/lib/db";

export async function getAllInventoryItems() {
  try {
    const connection = await createConnection();
    const [rows] = await connection.query("SELECT * FROM inventory_data");
    return rows;
  } catch (error) {
    console.log("Error fetching inventory items:", error);
  }
}

export async function getInventoryItemById(itemId: number) {
  try {
    const connection = await createConnection();
    const [rows] = await connection.query(
      "SELECT * FROM inventory_data WHERE item_encoded = ?",
      [itemId]
    );
    return rows;
  } catch (error) {
    console.log("Error fetching inventory item by ID:", error);
  }
}

export async function getInventoryItems(page: number, limit: number) {
  try {
    const connection = await createConnection();
    const offset = (page - 1) * limit;
    const [rows] = await connection.query(
      "SELECT * FROM inventory_data LIMIT ? OFFSET ?",
      [limit, offset]
    );
    return rows;
  } catch (error) {
    console.log("Error fetching inventory items:", error);
    return null
  }
}
