# MetroMart

MetroMart is a full-stack supermarket management system for handling products, customers, employees, departments, suppliers, sales, returns, supply orders, and inventory workflows.

The project is built with Node.js, Express, EJS, and Supabase. It is designed to run locally during development and can be deployed on Vercel with Supabase as the hosted PostgreSQL database.

Live demo: https://metro-mart-eta.vercel.app

## Features

- Dashboard for supermarket activity and summary metrics
- Customer, employee, department, product, and supplier management
- Sales invoice and sales detail workflows
- Product returns management
- Supply order tracking
- Inventory stock updates through database triggers
- Supabase-backed PostgreSQL schema with foreign keys and constraints
- Graceful module pages that still render if data fetching fails

## Tech Stack

- Node.js
- Express.js
- EJS
- Supabase
- PostgreSQL
- Vercel

## Project Structure

```text
MetroMart/
+-- app.js
+-- db/
|   +-- pool.js
+-- routes/
+-- views/
+-- public/
+-- scripts/
+-- schema.sql
+-- ddl.sql
+-- package.json
+-- README.md
```

## Local Setup

Install dependencies:

```bash
npm install
```

Create a local `.env` file in the project root:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_or_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_DB_URL=your_optional_postgres_connection_string
```

`SUPABASE_DB_URL` is optional for many routes because the app can use the Supabase REST client. If you use it, prefer the Supabase Session Pooler connection string for hosted deployments.

Start the app:

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

## Database Setup

The database schema is stored in `schema.sql`.

To initialize Supabase:

1. Open your Supabase project.
2. Go to SQL Editor.
3. Run the contents of `schema.sql`.
4. Run the contents of `ddl.sql` to load sample data.

`ddl.sql` clears the MetroMart tables with `TRUNCATE ... RESTART IDENTITY CASCADE` before inserting sample data, so it is intended for development/demo data resets.

## Useful SQL Checks

Check table counts:

```sql
select 'customers' as table_name, count(*) from customers
union all
select 'employees', count(*) from employees
union all
select 'department', count(*) from department
union all
select 'products', count(*) from products
union all
select 'suppliers', count(*) from suppliers;
```

Check products with departments:

```sql
select
  p.product_code,
  p.product_name,
  p.price,
  p.stock,
  d.dep_name
from products p
join department d on d.dep_id = p.dep_num
order by p.product_code;
```

## Deployment

This project can be deployed on Vercel.

In Vercel, add the required environment variables under:

```text
Project Settings -> Environment Variables
```

Required variables:

```env
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Optional:

```env
SUPABASE_DB_URL
```

Never commit `.env` files or database credentials to GitHub.

## Notes

- `schema.sql` creates tables, constraints, triggers, and disables RLS for the current development setup.
- `ddl.sql` inserts demo data for testing the UI quickly.
- Some routes use direct PostgreSQL queries first and fall back to Supabase REST where implemented.
