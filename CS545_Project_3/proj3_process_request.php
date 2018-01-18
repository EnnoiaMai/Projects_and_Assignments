<?php
/*
Nguyen, Thuc
jadrn041
Project #3
Fall 2017
*/

include 'write_error.php';

# Check if request is POST
if (!$_POST) {
    $error_message = 'This script can only be called from a form.';
    write_error($error_message); 
    exit;
}

# Call validation function and output error_form if validate returns false
include 'validation.php';

if (!validate_data()) {
    include 'error_form_functions.php';
    include 'error_form.php';
    exit;
}

# Check if able to upload image, exit if can't
include 'upload_image.php';

# Connect to database and store the new record
include 'database_functions.php';
insert_data_into_db();

# Print out the confirmation if everything is successful
include 'confirmation.php';

?>
