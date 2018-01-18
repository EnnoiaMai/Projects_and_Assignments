<?php
/*
Nguyen, Thuc
jadrn041
Project #3
Fall 2017
*/
include 'database_functions.php';

// Get a database connection
$database = start_db_connection();

// Get values from registration_jquery AJAX call
$email = $_GET['email'];
$phone_number = $_GET['phoneArea'] . $_GET['phone3'] . $_GET['phone4'];

// Query database for records with same email and phone number
$sql_query = "SELECT * FROM marathon_runners WHERE phone_number = '$phone_number' AND email = '$email';";
mysqli_query($database, $sql_query);
$affected_rows = mysqli_affected_rows($database);

// Stop the database connection
end_db_connection($database);

// Send back dup for duplicate, suc for non-duplicate, and err for an error
if ($affected_rows > 0) {
    echo "dup";
} elseif ($affected_rows == 0) {
    echo "suc";
} else {
    echo "err";
}

?>
