let editingId = null;

const form = document.getElementById("productForm");
const productNumberInput = document.getElementById("productNumber");
const typeInput = document.getElementById("type");
const descriptionInput = document.getElementById("description");
const priceInput = document.getElementById("price");
const submitBtn = document.getElementById("submitBtn");
const searchInput = document.getElementById("searchInput");
const productTable = document.getElementById("productTable");

function setEditingMode(product) {
  productNumberInput.value = product.ProductNumber;
  productNumberInput.disabled = true;
  typeInput.value = product.Type;
  descriptionInput.value = product.Description;
  priceInput.value = product.Price;
  editingId = Number(product.ProductNumber);
  submitBtn.textContent = "Update Product";
}

function resetForm() {
  editingId = null;
  form.reset();
  productNumberInput.disabled = false;
  submitBtn.textContent = "Add Product";
}

async function request(url, options = {}) {
  const response = await fetch(url, options);
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : { error: await response.text() };

  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const product = {
    ProductNumber: Number(productNumberInput.value),
    Type: typeInput.value.trim(),
    Description: descriptionInput.value.trim(),
    Price: Number(priceInput.value),
  };

  try {
    if (editingId !== null) {
      await request(`/api/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Type: product.Type,
          Description: product.Description,
          Price: product.Price,
        }),
      });
    } else {
      await request("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
    }

    resetForm();
    await fetchProducts(searchInput.value.trim());
  } catch (error) {
    alert(error.message);
  }
});

async function fetchProducts(search = "") {
  try {
    const data = await request(`/api/products?search=${encodeURIComponent(search)}`);
    displayProducts(data);
  } catch (error) {
    productTable.innerHTML = "";
    const row = productTable.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 5;
    cell.textContent = `Error: ${error.message}`;
  }
}

function displayProducts(products) {
  productTable.innerHTML = "";

  const header = productTable.insertRow();
  ["Number", "Type", "Description", "Price", "Actions"].forEach((title) => {
    const cell = document.createElement("th");
    cell.textContent = title;
    header.appendChild(cell);
  });

  products.forEach((product) => {
    const row = productTable.insertRow();

    [product.ProductNumber, product.Type, product.Description, product.Price].forEach(
      (value) => {
        const cell = row.insertCell();
        cell.textContent = value;
      }
    );

    const actions = row.insertCell();

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => setEditingMode(product));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";
    deleteButton.addEventListener("click", () => deleteProduct(product.ProductNumber));

    actions.append(editButton, " ", deleteButton);
  });
}

async function deleteProduct(productNumber) {
  if (!confirm(`Delete product ${productNumber}?`)) return;

  try {
    await request(`/api/products/${productNumber}`, { method: "DELETE" });

    if (editingId === Number(productNumber)) {
      resetForm();
    }

    await fetchProducts(searchInput.value.trim());
  } catch (error) {
    alert(error.message);
  }
}

searchInput.addEventListener("input", () => {
  fetchProducts(searchInput.value.trim());
});

fetchProducts();
