<?php
/*
Nguyen, Thuc
jadrn041
Project #3
Fall 2017
*/

/*
This file handles uploading the runner's image onto the server. Checks first
if the file already exists, then if there was any error including exceeding the
max file size, and then checking the file type before uploading.
*/

$UPLOAD_DIR = 'runners_image_dir/';
// $ABS_PATH_DIR = '/home/jadrn041/public_html/proj3/runners_image_dir/';
$file_name = $_FILES['uploadImage']['name'];
$file_temp_name = $_FILES['uploadImage']['tmp_name'];

# Use this global variable as path to store in database
$runners_image = "$UPLOAD_DIR" . $phone_number;

# Check if image of the particular user already exists on the server
if (file_exists("$UPLOAD_DIR" . $phone_number)) {
    $error_message = "This user already exists.";
    write_error($error_message);
    exit;
}
# Check for errors in uploading, including exceeding max file size
elseif ($_FILES['uploadImage']['error'] > 0) {
    $error_code = $_FILES['uploadImage']['error'];
    $error_message = "Error Code: $error_code";
    if ($error_code == 1) {
        $error_message .= 'The file was too large - it must be less than 2MB.';
    }
    write_error($error_message);
    exit;
}
# Check that image extension is either jpeg, png, or bmp
elseif (exif_imagetype($file_temp_name) != IMAGETYPE_JPEG && exif_imagetype($file_temp_name) != IMAGETYPE_PNG && exif_imagetype($file_temp_name) != IMAGETYPE_BMP) {
    $error_message = 'The file was not one of the following extensions: .jpeg, .png, or .bmp';
    write_error($error_message);
    exit;
}

# Proceed to copying the temporary copy of the file on the server to the specified directory
else {
    move_uploaded_file($file_temp_name, "$UPLOAD_DIR" . $phone_number);
}


?>
