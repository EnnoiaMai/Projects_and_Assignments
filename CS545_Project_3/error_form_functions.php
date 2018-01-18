<?php
/*
Nguyen, Thuc
jadrn041
Project #3
Fall 2017
*/

# Return "checked" attribute for all radio buttons that user selected
function test_checked($value) {
    global $gender, $experience, $age_category;

    if ($value == 'male' || $value == 'female') {
        return ($value == $gender) ? "checked" : "";
    }
    if ($value == 'novice' || $value == 'experienced' || $value == 'expert') {
        return ($value == $experience) ? "checked" : "";
    }
    if ($value == 'teen' || $value == 'adult' || $value == 'senior') {
        return ($value == $age_category) ? "checked" : "";
    }
}

# Returns "selected" attribute for drop down that user selected
function test_selected($value) {
    global $state;
    return ($value == $state) ? "selected" : "";
}

# Show or hide error messages
function test_error($key) {
    global $error_assoc_array;
    return (array_key_exists($key, $error_assoc_array)) ? $error_assoc_array[$key] : "";
}

# Ask user to upload Runner's Image again if he/she hasn't already
function test_error_image($key) {
    global $error_assoc_array;
    return (array_key_exists($key, $error_assoc_array)) ? "" : "The file uploaded was \"" . $_FILES['uploadImage']['name'] . "\"" . ". Please upload the file again.";
}
?>
