# Hassan Store - Node.js Version

The original PHP web project has been converted to **JavaScript + Node.js + Express**.

## Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js + Express
- Database: MySQL
- Driver: mysql2

## Database safety

**Starting the Node.js server does NOT create, drop, alter, or seed any database table.**

The server only:
1. Connects to the existing `hassan_OnlineStoreDB` database.
2. Reads products with `GET /api/products`.
3. Changes product rows only when you explicitly use Add, Update, or Delete in the web page.

The original SQL file is kept in `../data base project/hassan_OnlineStoreProject.sql` and has not been changed.

## Run

1. Make sure MySQL is running (XAMPP is fine).
2. Make sure the existing database `hassan_OnlineStoreDB` exists.
3. Copy `.env.example` to `.env` if needed and set your MySQL password.
4. Open this folder in CMD/PowerShell.
5. Run:

```bash
npm install
npm start
```

6. Open:

```text
http://localhost:3000
```

## API

- `GET /api/products`
- `GET /api/products?search=Wireless`
- `POST /api/products`
- `PUT /api/products/:productNumber`
- `DELETE /api/products/:productNumber`

## Important

The screenshots and video from the original submission were preserved.

No PHP files are required anymore.
