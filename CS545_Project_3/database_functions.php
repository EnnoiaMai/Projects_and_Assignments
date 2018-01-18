<?php
/*
Nguyen, Thuc
jadrn041
Project #3
Fall 2017
*/

# Functions for connecting and disconnecting to database
function start_db_connection() {
    $server = '';
    $user = '';
    $password = '';
    $database = '';

    if ( !($db = mysqli_connect($server, $user, $password, $database)) ) {
        $error_message = "SQL Error: Connection failed: " .mysqli_error($db);
        write_error($error_message);
        exit;
    }
    mysqli_set_charset($db, "utf8");
    return $db;
}

function end_db_connection($db) {
    mysqli_close($db);
}

# Escape data going into the database
function escape_string($db, $data) {
    return mysqli_real_escape_string($db, $data);
}

/*=============================== REGISTER ===================================*/
# Function to insert data to database
function insert_data_into_db() {
    global $first_name, $middle_name, $last_name, $address, $city, $state, $zip_code, $phone_number, $email, $dob, $gender, $med_cond, $experience, $age_category;

    # Getting the database connection
    $database = start_db_connection();

    # Escape the data
    $first_name = escape_string($database, $first_name);
    $middle_name = escape_string($database, $middle_name);
    $last_name = escape_string($database, $last_name);
    $address = escape_string($database, $address);
    $city = escape_string($database, $city);
    $email = escape_string($database, $email);
    $med_cond = escape_string($database, $med_cond);

    # Query statement
    $sql_query = "SELECT * FROM marathon_runners WHERE phone_number = '$phone_number' AND email = '$email';";

    # Check for duplicates
    $result = mysqli_query($database, $sql_query);
    if (mysqli_num_rows($result) > 0) {
        end_db_connection($database);
        $error_message = 'This record appears to be a duplicate.';
        write_error($error_message);
        exit;
    }
    elseif (mysqli_num_rows($result) != 0) {
        end_db_connection($database);
        $error_message = 'There was an error with the query.';
        write_error($error_message);
        exit;
    }

    # Insert if duplicate check passed
    $sql_query = "INSERT INTO marathon_runners(runners_image,first_name,middle_name,last_name," .
    "address,city,state,zip_code,phone_number,email,dob,gender,med_cond,experience,age_category) " .
    "VALUES('$phone_number','$first_name','$middle_name','$last_name','$address','$city','$state'," .
    "'$zip_code','$phone_number','$email','$dob','$gender','$med_cond','$experience','$age_category');";

    // echo "sql query was: $sql_query";

    mysqli_query($database, $sql_query);
    // $num_affected_rows = mysqli_affected_rows($database);
    // echo "Number of affected rows were $num_affected_rows";
    end_db_connection($database);
}
?>
