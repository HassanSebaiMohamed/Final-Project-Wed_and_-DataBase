<?php
include 'db.php';
$data = json_decode(file_get_contents("php://input"));
$stmt = $conn->prepare("DELETE FROM hassan_Product WHERE ProductNumber = ?");
$stmt->bind_param("i", $data->ProductNumber);
$stmt->execute();
echo json_encode(["success" => true]);
?>