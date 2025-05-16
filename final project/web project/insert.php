<?php
include 'db.php';
$data = json_decode(file_get_contents("php://input"));
$stmt = $conn->prepare("INSERT INTO hassan_Product (ProductNumber, Type, Description, Price) VALUES (?, ?, ?, ?)");
$stmt->bind_param("issd", $data->ProductNumber, $data->Type, $data->Description, $data->Price);
$stmt->execute();
echo json_encode(["success" => true]);
?>