import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  varchar,
  jsonb,
  decimal,
} from "drizzle-orm/pg-core";

export const categories = pgTable("ap_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  image: text("image"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("ap_products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }),
  categoryId: integer("category_id").references(() => categories.id),
  images: jsonb("images").$type<string[]>().default([]),
  sizes: jsonb("sizes").$type<string[]>().default([]),
  colors: jsonb("colors").$type<string[]>().default([]),
  fabric: varchar("fabric", { length: 255 }),
  pieces: varchar("pieces", { length: 100 }),
  inStock: boolean("in_stock").default(true),
  stockQuantity: integer("stock_quantity").default(0).notNull(),
  isFeatured: boolean("is_featured").default(false),
  isNew: boolean("is_new").default(false),
  isSale: boolean("is_sale").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orders = pgTable("ap_orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  shippingAddress: text("shipping_address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }),
  items: jsonb("items")
    .$type<
      {
        productId: number;
        name: string;
        price: number;
        quantity: number;
        size: string;
        color: string;
        image: string;
      }[]
    >()
    .notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  paymentMethod: varchar("payment_method", { length: 50 })
    .default("cod")
    .notNull(),
  trackingId: varchar("tracking_id", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
