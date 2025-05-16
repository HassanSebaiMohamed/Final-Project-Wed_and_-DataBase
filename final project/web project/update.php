<?php
include 'db.php';
$data = json_decode(file_get_contents("php://input"));
$stmt = $conn->prepare("UPDATE hassan_Product SET Type=?, Description=?, Price=? WHERE ProductNumber=?");
$stmt->bind_param("ssdi", $data->Type, $data->Description, $data->Price, $data->ProductNumber);
$stmt->execute();
echo json_encode(["success" => true]);
?>