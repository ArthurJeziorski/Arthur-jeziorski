CREATE TABLE IF NOT EXISTS "users" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(63) NOT NULL,
	"password" VARCHAR(63) NOT NULL,
	"role" VARCHAR(63) NOT NULL CHECK(role in ('OPERATOR', 'ADMIN'))
);

CREATE TABLE IF NOT EXISTS "products" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(255) NOT NULL,
	"amount" INTEGER NOT NULL DEFAULT 1,
);

CREATE TABLE IF NOT EXISTS "audits" (
	"id" SERIAL,
	"user_id" INTEGER NOT NULL,
	"product_id" INTEGER,
	"action" VARCHAR(255) NOT NULL CHECK(action in ('CREATE', 'UPDATE', 'DELETE')),
	PRIMARY KEY("id", "user_id", "product_id")
);

ALTER TABLE "audits"
ADD CONSTRAINT "fk_audits_user"
FOREIGN KEY("user_id") REFERENCES "users"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "audits"
ADD CONSTRAINT "fk_audits_product"
FOREIGN KEY("product_id") REFERENCES "products"("id")
ON UPDATE CASCADE ON DELETE SET NULL;