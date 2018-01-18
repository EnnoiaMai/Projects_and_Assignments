<?php
/*
Nguyen, Thuc
jadrn041
Project #3
Fall 2017
*/

# Grab form data and put into variables
$first_name = sanitize_data($_POST['firstName']);
$middle_name = sanitize_data($_POST['middleName']);
$last_name = sanitize_data($_POST['lastName']);
$address = sanitize_data($_POST['address']);
$city = sanitize_data($_POST['city']);
$state = $_POST['stateDropDown'];
$zip_code = sanitize_data($_POST['zipCode']);
$phone_number = sanitize_data($_POST['phoneArea']) . sanitize_data($_POST['phone3']) . sanitize_data($_POST['phone4']);
$email = sanitize_data($_POST['email']);
$dob = sanitize_data($_POST['dateOfBirth']);
$gender = isset($_POST['genderRadio']) ? $_POST['genderRadio']: NULL;
$med_cond = sanitize_data($_POST['medicalTextArea']);
$experience = isset($_POST['expRadio']) ? $_POST['expRadio']: NULL;
$age_category = isset($_POST['ageRadio']) ? $_POST['ageRadio'] : NULL;

$error_assoc_array = array();   # Key-values to write out errors in heredoc

# Trim and Sanitize
function sanitize_data($data) {
    $data = trim($data);
    $data = htmlspecialchars($data);
    return $data;
}

# Check for required fields, sanitize and validate the data
function validate_data() {
    $success = true;

    global $error_assoc_array, $first_name, $last_name, $address, $city, $state, $zip_code, $phone_number, $email, $dob, $gender, $experience, $age_category;

    # VALIDATE RUNNER'S IMAGE
    if (empty($_FILES['uploadImage']['name'])) {
        $error_assoc_array['image'] = "Select an image file to upload.";
        $success = false;
    }

    # VALIDATE NAMES
    if (strlen($first_name) == 0) {
        $error_assoc_array['name'] = "Input fields for first and last name cannot be empty.";
        $success = false;
    }
    if (strlen($last_name) == 0) {
        if (!array_key_exists('name', $error_assoc_array)) {
            $error_assoc_array['name'] = "Input fields for first and last name cannot be empty.";
        }
        $success = false;
    }

    # VALIDATE ADDRESS
    if (strlen($address) == 0) {
        $error_assoc_array['address'] = "A state must be selected. The zip code must contain a five-digit value. Input field cannot be empty.";
        $success = false;
    }
    if (strlen($city) == 0) {
        if (!array_key_exists('address', $error_assoc_array)) {
            $error_assoc_array['address'] = "A state must be selected. The zip code must contain a five-digit value. Input field cannot be empty.";
        }
        $success = false;
    }
    if (strlen($state) == "null") {
        if (!array_key_exists('address', $error_assoc_array)) {
            $error_assoc_array['address'] = "A state must be selected. The zip code must contain a five-digit value. Input field cannot be empty.";
        }
        $success = false;
    }

    # Check that zip code is numeric and length of 5 digits
    if ( !is_numeric($zip_code) || (strlen($zip_code) != 5) ) {
        if (!array_key_exists('address', $error_assoc_array)) {
            $error_assoc_array['address'] = "A state must be selected. The zip code must contain a five-digit value. Input field cannot be empty.";
        }
        $success = false;
    }

    # VALIDATE PHONE NUMBER - Check that phone number is legal, numeric, and that length is 10 digits
    if ( (strlen($phone_number) != 10) || (!is_numeric($phone_number)) || (!preg_match("/[2-9]{1}\d{2}[2-9]{1}\d{2}\d{4}/" , $phone_number)) ) {
        $error_assoc_array['phone_number'] = "Enter a valid phone number. Phone numbers may not contain letters or special characters. Input field cannot be empty.";
        $success = false;
    }

    # VALIDATE EMAIL - use filter_var
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);
    if ( (strlen($email) == 0) || (!filter_var($email, FILTER_VALIDATE_EMAIL)) ) {
        $error_assoc_array['email'] = "Email must contain the local-part, the @ symbol, and a valid domain. Input field cannot be empty.";
        $success = false;
    }

    # VALIDATE DATE OF BIRTH
    $dob_array = preg_split("/[.\/ -]/", $dob);
    $pattern_month_and_day = "/\d{2}/";
    $pattern_year = "/\d{4}/";

    # If field is empty or user added too little/too many separators
    if ( (strlen($dob) == 0) || (count($dob_array) != 3) ) {
        $error_assoc_array['dob'] = "Provide a valid date. Add the '/' separator after entering the month and day. Input field cannot be empty.";
        $success = false;
    }
    else {
        $month = $dob_array[0];
        $day = $dob_array[1];
        $year = $dob_array[2];

        # If month, day, and year doesn't match the patterns
        if ( (!preg_match($pattern_month_and_day, $month)) || (!preg_match($pattern_month_and_day, $day)) || (!preg_match($pattern_year, $year)) ) {
            if (!array_key_exists('dob', $error_assoc_array)) {
                $error_assoc_array['dob'] = "Provide a valid date. Add the '/' separator after entering the month and day. Input field cannot be empty.";
            }
            $success = false;
        }

        # If the date exists
        if (!checkdate($month, $day, $year)) {
            if (!array_key_exists('dob', $error_assoc_array)) {
                $error_assoc_array['dob'] = "Provide a valid date. Add the '/' separator after entering the month and day. Input field cannot be empty.";
            }
            $success = false;
        }
    }

    # VALIDATE GENDER, EXPERIENCE, AND AGE CATEGORY
    if (empty($gender)) {
        $error_assoc_array['gender'] = "Select your gender.";
        $success = false;
    }
    if (empty($experience)) {
        $error_assoc_array['experience'] = "Select your experience level.";
        $success = false;
    }
    if (empty($age_category)) {
        $error_assoc_array['age'] = "Select your age category.";
        $success = false;
    }

    return $success;
}
?>
