CREATE DATABASE IF NOT EXISTS hassan_OnlineStoreDB;
USE hassan_OnlineStoreDB;
CREATE TABLE hassan_Customer (
    CustomerNumber INT PRIMARY KEY,
    Name VARCHAR(100),
    Address VARCHAR(255)
);
CREATE TABLE hassan_Product (
    ProductNumber INT PRIMARY KEY,
    Type VARCHAR(50),
    Description VARCHAR(255),
    Price DECIMAL(10, 2)
);
CREATE TABLE hassan_Orders (
    OrderNumber INT PRIMARY KEY,
    OrderDate DATE,
    OrderAddress VARCHAR(255),
    PaymentInfo VARCHAR(100),
    CustomerNumber INT,
    FOREIGN KEY (CustomerNumber) REFERENCES hassan_Customer(CustomerNumber)
);
CREATE TABLE hassan_OrderItem (
    ItemName VARCHAR(100),
    Price DECIMAL(10, 2),
    Discount DECIMAL(5, 2),
    Quantity INT,
    SpecialOption VARCHAR(100),
    OrderNumber INT,
    ProductNumber INT,
    PRIMARY KEY (ItemName),
    FOREIGN KEY (OrderNumber) REFERENCES hassan_Orders(OrderNumber),
    FOREIGN KEY (ProductNumber) REFERENCES hassan_Product(ProductNumber)
);
INSERT INTO hassan_Customer VALUES
(1, 'Ahmed Ali', 'Cairo'),
(2, 'hassan sebai', 'Alexandria'),
(3, 'Mohamed Tarek', 'Giza'),
(4, 'Nora Adel', 'Mansoura'),
(5, 'Khaled Fathy', 'Tanta'),
(6, 'Laila Sami', 'Aswan'),
(7, 'Youssef Hamdy', 'Luxor'),
(8, 'Mona Saeed', 'Zagazig'),
(9, 'Ramy Nabil', 'Ismailia'),
(10, 'Dina Rami', 'Port Said');
INSERT INTO hassan_Product VALUES
(101, 'Electronics', 'Wireless Headphones', 850.00),
(102, 'Clothing', 'Cotton T-shirt', 120.00),
(103, 'Books', 'Database Systems Book', 300.00),
(104, 'Electronics', 'Bluetooth Speaker', 400.00),
(105, 'Clothing', 'Denim Jacket', 550.00),
(106, 'Books', 'Learning SQL', 250.00),
(107, 'Home', 'LED Lamp', 150.00),
(108, 'Electronics', 'Smart Watch', 1250.00),
(109, 'Home', 'Cooking Set', 999.00),
(110, 'Books', 'E-commerce Strategies', 275.00);
INSERT INTO hassan_Orders VALUES
(1001, '2025-01-10', 'Cairo', 'Visa', 1),
(1002, '2025-02-12', 'Alexandria', 'Cash', 2),
(1003, '2025-03-15', 'Giza', 'PayPal', 3),
(1004, '2025-01-20', 'Mansoura', 'Visa', 4),
(1005, '2025-03-30', 'Tanta', 'MasterCard', 5),
(1006, '2025-04-05', 'Aswan', 'Cash', 6),
(1007, '2025-02-22', 'Luxor', 'PayPal', 7),
(1008, '2025-01-25', 'Zagazig', 'Visa', 8),
(1009, '2025-04-10', 'Ismailia', 'MasterCard', 9),
(1010, '2025-02-05', 'Port Said', 'Cash', 10);
INSERT INTO hassan_OrderItem VALUES
('ItemA', 850.00, 0.00, 1, 'Black', 1001, 101),
('ItemB', 120.00, 5.00, 2, 'M', 1002, 102),
('ItemC', 300.00, 0.00, 1, 'Hardcover', 1003, 103),
('ItemD', 400.00, 10.00, 1, 'Blue', 1004, 104),
('ItemE', 550.00, 20.00, 1, 'L', 1005, 105),
('ItemF', 250.00, 0.00, 2, 'PDF', 1006, 106),
('ItemG', 150.00, 0.00, 3, 'Warm White', 1007, 107),
('ItemH', 1250.00, 50.00, 1, 'Silver', 1008, 108),
('ItemI', 999.00, 30.00, 1, 'Full Set', 1009, 109),
('ItemJ', 275.00, 0.00, 1, 'Paperback', 1010, 110);
SELECT * FROM hassan_Product WHERE Description LIKE '%Wireless%';
SELECT COUNT(*) AS TotalOrders FROM hassan_Orders;
SELECT * FROM hassan_Customer ORDER BY Name ASC;
SELECT Type, COUNT(*) AS NumberOfProducts FROM hassan_Product GROUP BY Type;
SELECT * FROM hassan_Orders WHERE OrderDate > '2025-03-01';
