<?php
include 'db.php';
$data = json_decode(file_get_contents("php://input"));
$search = $data->search;
$sql = "SELECT * FROM hassan_Product WHERE Type LIKE ? OR Description LIKE ?";
$stmt = $conn->prepare($sql);
$searchTerm = "%" . $search . "%";
$stmt->bind_param("ss", $searchTerm, $searchTerm);
$stmt->execute();
$result = $stmt->get_result();
$rows = [];
while ($row = $result->fetch_assoc()) {
    $rows[] = $row;
}
echo json_encode($rows);
?>