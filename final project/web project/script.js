let editingId = null;

function editProduct(product) {
  document.getElementById("productNumber").value = product.ProductNumber;
  document.getElementById("type").value = product.Type;
  document.getElementById("description").value = product.Description;
  document.getElementById("price").value = product.Price;
  editingId = product.ProductNumber;
  document.getElementById("submitBtn").textContent = "Update Product";
}

document.getElementById("productForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const product = {
    ProductNumber: document.getElementById("productNumber").value,
    Type: document.getElementById("type").value,
    Description: document.getElementById("description").value,
    Price: parseFloat(document.getElementById("price").value),
  };
  const url = editingId ? "update.php" : "insert.php";
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });
  editingId = null;
  document.getElementById("submitBtn").textContent = "Add Product";
  this.reset();
  fetchProducts(""); // إعادة عرض الكل
});

async function fetchProducts(search = "") {
  const res = await fetch("search.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ search })
  });
  const data = await res.json();
  displayProducts(data);
}

function displayProducts(data) {
  const table = document.getElementById("productTable");
  table.innerHTML = `
    <tr>
      <th>Number</th>
      <th>Type</th>
      <th>Description</th>
      <th>Price</th>
      <th>Actions</th>
    </tr>
  `;

  data.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.ProductNumber}</td>
      <td>${product.Type}</td>
      <td>${product.Description}</td>
      <td>${product.Price}</td>
      <td>
        <button onclick='editProduct(${JSON.stringify(product)})'>Edit</button>
        <button onclick='deleteProduct(${product.ProductNumber})'>Delete</button>
      </td>
    `;
    table.appendChild(row);
  });
}

async function deleteProduct(id) {
  await fetch("delete.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ProductNumber: id })
  });
  fetchProducts("");
}

document.getElementById("searchInput").addEventListener("input", () => {
  const keyword = document.getElementById("searchInput").value;
  fetchProducts(keyword);
});

fetchProducts(""); // أول ما الصفحة تفتح، يعرض كل المنتجات