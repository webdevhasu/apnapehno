CREATE TABLE "ap_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"image" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ap_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "ap_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" varchar(50) NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"customer_email" varchar(255),
	"customer_phone" varchar(50) NOT NULL,
	"shipping_address" text NOT NULL,
	"city" varchar(100) NOT NULL,
	"postal_code" varchar(20),
	"items" jsonb NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"payment_method" varchar(50) DEFAULT 'cod' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ap_orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "ap_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(500) NOT NULL,
	"slug" varchar(500) NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"sale_price" numeric(10, 2),
	"category_id" integer,
	"images" jsonb DEFAULT '[]'::jsonb,
	"sizes" jsonb DEFAULT '[]'::jsonb,
	"colors" jsonb DEFAULT '[]'::jsonb,
	"fabric" varchar(255),
	"pieces" varchar(100),
	"in_stock" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"is_new" boolean DEFAULT false,
	"is_sale" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ap_products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "ap_products" ADD CONSTRAINT "ap_products_category_id_ap_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."ap_categories"("id") ON DELETE no action ON UPDATE no action;