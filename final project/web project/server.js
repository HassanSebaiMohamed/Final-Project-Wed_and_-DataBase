require("dotenv").config();

const express = require("express");
const path = require("path");
const { pool, testConnection } = require("./db");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const publicDir = path.join(__dirname, "public");

app.use(express.json());
app.use(express.static(publicDir));

function validateProduct(body, requireProductNumber = true) {
  const { ProductNumber, Type, Description, Price } = body || {};

  if (
    requireProductNumber &&
    (!Number.isInteger(Number(ProductNumber)) || Number(ProductNumber) <= 0)
  ) {
    return "Product Number must be a positive integer.";
  }

  if (!String(Type ?? "").trim()) return "Type is required.";
  if (!String(Description ?? "").trim()) return "Description is required.";

  const price = Number(Price);
  if (!Number.isFinite(price) || price < 0) {
    return "Price must be a valid non-negative number.";
  }

  return null;
}

// GET all products, or search by Type / Description.
app.get("/api/products", async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();
    const searchTerm = `%${search}%`;

    const [rows] = await pool.execute(
      `SELECT ProductNumber, Type, Description, Price
       FROM hassan_Product
       WHERE Type LIKE ? OR Description LIKE ?
       ORDER BY ProductNumber`,
      [searchTerm, searchTerm]
    );

    res.json(rows);
  } catch (error) {
    console.error("GET /api/products:", error);
    res.status(500).json({ success: false, error: "Failed to fetch products." });
  }
});

// Insert a product.
app.post("/api/products", async (req, res) => {
  const validationError = validateProduct(req.body);
  if (validationError) {
    return res.status(400).json({ success: false, error: validationError });
  }

  try {
    const { ProductNumber, Type, Description, Price } = req.body;

    await pool.execute(
      `INSERT INTO hassan_Product
       (ProductNumber, Type, Description, Price)
       VALUES (?, ?, ?, ?)`,
      [Number(ProductNumber), String(Type).trim(), String(Description).trim(), Number(Price)]
    );

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("POST /api/products:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        error: "A product with this Product Number already exists.",
      });
    }

    res.status(500).json({ success: false, error: "Failed to insert product." });
  }
});

// Update a product. ProductNumber remains the identifier, matching the old PHP app.
app.put("/api/products/:productNumber", async (req, res) => {
  const productNumber = Number(req.params.productNumber);

  if (!Number.isInteger(productNumber) || productNumber <= 0) {
    return res.status(400).json({ success: false, error: "Invalid Product Number." });
  }

  const validationError = validateProduct(req.body, false);
  if (validationError) {
    return res.status(400).json({ success: false, error: validationError });
  }

  try {
    const { Type, Description, Price } = req.body;

    const [result] = await pool.execute(
      `UPDATE hassan_Product
       SET Type = ?, Description = ?, Price = ?
       WHERE ProductNumber = ?`,
      [String(Type).trim(), String(Description).trim(), Number(Price), productNumber]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Product not found." });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("PUT /api/products/:productNumber:", error);
    res.status(500).json({ success: false, error: "Failed to update product." });
  }
});

// Delete a product.
app.delete("/api/products/:productNumber", async (req, res) => {
  const productNumber = Number(req.params.productNumber);

  if (!Number.isInteger(productNumber) || productNumber <= 0) {
    return res.status(400).json({ success: false, error: "Invalid Product Number." });
  }

  try {
    const [result] = await pool.execute(
      "DELETE FROM hassan_Product WHERE ProductNumber = ?",
      [productNumber]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Product not found." });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/products/:productNumber:", error);
    res.status(500).json({ success: false, error: "Failed to delete product." });
  }
});

// Serve the frontend.
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

async function start() {
  try {
    await testConnection();
    console.log("MySQL connected successfully.");
    console.log(`Hassan Store running at http://localhost:${PORT}`);
    console.log("No database tables or records are created/modified when the server starts.");
    app.listen(PORT);
  } catch (error) {
    console.error("Could not connect to MySQL.");
    console.error(error.message);
    console.error(
      "Make sure MySQL/XAMPP is running and the database credentials in .env are correct."
    );
    process.exit(1);
  }
}

start();
