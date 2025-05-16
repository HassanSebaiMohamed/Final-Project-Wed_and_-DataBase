<?php
require 'db.php';
$search = isset($_GET['search']) ? "%" . $conn->real_escape_string($_GET['search']) . "%" : '%';
$sql = "SELECT * FROM hassan_Product WHERE Description LIKE ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $search);
$stmt->execute();
$result = $stmt->get_result();
$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}
echo json_encode($data);
?>