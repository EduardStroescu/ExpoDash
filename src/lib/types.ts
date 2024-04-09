import { Database } from "./database.types";

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

export type ProductSize = "S" | "M" | "L" | "XL";

export type CartItem = {
  id: string;
  product: Tables<"products">;
  product_id: number;
  size: ProductSize;
  quantity: number;
};

export const OrderStatusList: OrderStatus[] = [
  "New",
  "Cooking",
  "Delivering",
  "Delivered",
];

export interface ProductData {
  id: number;
  name: string;
  description: string;
  s_price: number;
  m_price: number;
  l_price: number;
  xl_price: number;
  image?: string;
}

export type OrderStatus = "New" | "Cooking" | "Delivering" | "Delivered";
