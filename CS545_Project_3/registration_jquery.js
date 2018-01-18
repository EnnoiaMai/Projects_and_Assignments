/*
Nguyen, Thuc
jadrn041
Project #3
Fall 2017
*/

var flexRows;
var size;               // size of the runner's image file
var resetBorderList;    // reset all borders when user clicked reset
var firstError = false; // determine which elements need focus

// After DOM is loaded, set listeners to elements
$(document).ready(function() {
    setEventListeners();
});

function setEventListeners() {
    $("#back_button").on("click", function() {
        window.location.href = "index.html";
    });
    $("#back_button").on("mouseover", function() {
        $(this).attr("src", "back_button_hover.png");
    });
    $("#back_button").on("mouseout", function() {
        $(this).attr("src", "back_button.png");
    });

    $('input[name="uploadImage"]').on("change", function(event){
        var fileHandle = this.files[0];
        size = fileHandle.size;
        var fileObj = URL.createObjectURL(fileHandle);
        // var fileObj = URL.createObjectURL(event.target.files[0]);
        $("#image_container").attr("src", fileObj).show();
    });

    flexRows = $(".flex_row_container");

    $(':reset').on("click", function() {
        $("#image_container").hide();
        $('*[id^="error"][id$="div"]:visible').css("visibility", "hidden");
        $('input, #drop_down_container, .gender_row_container, .flex_row_container').css("border-color", "#fff");
        $("#duplicate_error_div p").text("ERROR: The information you provided appears to be a duplicate and already exists.");
        $("#duplicate_error_div").css("display", "none");
    });
    $(':submit').on("click", validateForm);
}

// Validate the form
function validateForm(event) {
    var success = true;

    if (!validatePhoto()) {
        success = false;
    }
    if (!validateName()) {
        success = false;
    }
    if (!validateAddress()) {
        success = false;
    }
    if (!validatePhoneNumber()) {
        success = false;
    }
    if (!validateEmail()) {
        success = false;
    }
    if (!validateDOB()) {
        success = false;
    }
    if (!validateGender()) {
        success = false;
    }
    if (!validateExp()) {
        success = false;
    }
    if (!validateAge()) {
        success = false;
    }

    // Reset firstError back to false to reapply focus on next validation
    firstError = false;

    // If success is true, check for duplicates (AJAX)
    if (success){
        // Prevent default event behavior and display busywait indicator
        event.preventDefault();
        $("#busywait").css("z-index", "10");

        var params = "email=" + $('input[name="email"]').val() + "&phoneArea=" + $('input[name="phoneArea"]').val() + "&phone3=" + $('input[name="phone3"]').val() + "&phone4=" + $('input[name="phone4"]').val();
        var url = "check_duplicate.php?" + params;
        $.get(url, duplicateHandler);
        return false;
    } else {
        return false;
    }
}

// Function that is triggered once async call to server responds
function duplicateHandler(response) {
    // Regardless of response, hide busywait indicator
    $("#busywait").css("z-index", "-10");

    // If record is a duplicate, display duplicate error
    if (response == "dup") {
        $('#duplicate_error_div').css("display", "block");
    }
    // If record isn't a duplicate, serialize and submit the form
    else if (response == "suc") {
        // $('form[name="registrationForm"]').serialize();
        // $('form[name="registrationForm"]').submit();
        $('#duplicate_error_div').css("display", "none");
        $('form').serialize();
        $('form').submit();
    }
    // Else there was an error
    else {
        $('#duplicate_error_div p').text("ERROR: An error occurred on the server.");
        $('#duplicate_error_div').css("display", "block");
    }
}

function setVisibility(success, selector) {
    if (success) {
        $(selector).css("visibility", "hidden");
    } else {
        $(selector).css("visibility", "visible");
    }
}
function setFocus(selector) {
    if (!firstError){
        firstError = true;
        $(selector).focus();
    }
}

// Validation Functions
function trim(string) {
    var trimmed = $.trim(string);
    return (trimmed.length > 0) ? true : false;
}

function validatePhoto() {
    var success = true;
    // if ( !(trim($('input[name="uploadImage"]').val())) ) {
    //     $('input[name="uploadImage"]').css("border-color", "red");
    //     success = false;
    // }
    if ( (size == 0) || ($('input[name="uploadImage"]').get(0).files.length === 0) ) {
        $('input[name="uploadImage"]').css("border-color", "red");
        $("#error_image_div p").text("Select an image file to upload.");
        success = false;
        setFocus('input[name="uploadImage"]');
        setVisibility(success, "#error_image_div");
        return success;
    }
    if ((size / 1000) > 1000) {
        $('input[name="uploadImage"]').css("border-color", "red");
        $("#error_image_div p").text("The file is must be less than 1MB.");
        setFocus('input[name="uploadImage"]');
        success = false;
    } else {
        $('input[name="uploadImage"]').css("border-color", "#fff");
    }
    setVisibility(success, "#error_image_div");
    return success;
}
function validateName() {
    var success = true;
    var firstNameVal = $('input[name="firstName"]').val();
    var middleNameVal = $('input[name="middleName"]').val();
    var lastNameVal = $('input[name="lastName"]').val();
    // var pattern = new RegExp(/[\&\>\<\"\*\?!#@\$%\^:;\(\)\+,=\[\]\{\}~\|`\n\t\r\/\\]+/);
    // pattern.test(nameVal)

    if ( !(trim(firstNameVal)) ) {
        $('input[name="firstName"]').css("border-color", "red");
        setFocus('input[name="firstName"]');
        success = false;
    } else {
        $('input[name="firstName"]').css("border-color", "#fff");
    }
    if ( !(trim(lastNameVal)) ) {
        $('input[name="lastName"]').css("border-color", "red");
        setFocus('input[name="lastName"]');
        success = false;
    } else {
        $('input[name="lastName"]').css("border-color", "#fff");
    }
    setVisibility(success, "#error_names_div");
    return success;
}
function validateAddress() {
    var success = true;
    var addressVal = $('input[name="address"]').val();
    var cityVal = $('input[name="city"]').val();
    var stateVal = $('select[name="stateDropDown"]').val();
    var zipCodeVal = $('input[name="zipCode"]').val();
    var pattern = new RegExp(/^\d{5}$/);

    if ( !(trim(addressVal)) ){
        $('input[name="address"]').css("border-color", "red");
        setFocus('input[name="address"]');
        success = false;
    } else {
        $('input[name="address"]').css("border-color", "#fff");
    }
    if ( !(trim(cityVal)) ){
        $('input[name="city"]').css("border-color", "red");
        setFocus('input[name="city"]');
        success = false;
    } else {
        $('input[name="city"]').css("border-color", "#fff");
    }
    if (stateVal == "null") {
        $("#drop_down_container").css("border-color", "red");
        setFocus('select[name="stateDropDown"]');
        success = false;
    } else {
        $("#drop_down_container").css("border-color", "#fff");
    }
    if ( !(pattern.test(zipCodeVal)) ) {
        $('input[name="zipCode"]').css("border-color", "red");
        setFocus('input[name="zipCode"]');
        success = false;
    } else {
        $('input[name="zipCode"]').css("border-color", "#fff");
    }
    setVisibility(success, "#error_address_div");
    return success;
}
function validatePhoneNumber() {
    var success = true;
    var phoneAreaVal = $('input[name="phoneArea"]').val();
    var phone3Val = $('input[name="phone3"]').val();
    var phone4Val = $('input[name="phone4"]').val();
    var patternArea3 = new RegExp(/^[2-9]{1}\d{2}$/);
    var pattern4 = new RegExp(/^\d{4}$/);

    if ( (!patternArea3.test(phoneAreaVal)) || (!patternArea3.test(phone3Val)) || (!pattern4.test(phone4Val)) ){
        $('input[name="phoneArea"]').css("border-color", "red");
        $('input[name="phone3"]').css("border-color", "red");
        $('input[name="phone4"]').css("border-color", "red");
        setFocus('input[name="phoneArea"]');
        success = false;
    } else {
        $('input[name="phoneArea"]').css("border-color", "#fff");
        $('input[name="phone3"]').css("border-color", "#fff");
        $('input[name="phone4"]').css("border-color", "#fff");
    }
    setVisibility(success, "#error_phone_div");
    return success;
}
function validateEmail() {
    var success = true;
    var emailVal = $('input[name="email"]').val();
    var pattern = new RegExp(/^[\w_.-]+\@[a-zA-Z_.-]+\.([a-zA-Z]){2,5}$/);

    if (!pattern.test(emailVal)) {
        $('input[name="email"]').css("border-color", "red");
        setFocus('input[name="email"]');
        success = false;
    } else {
        $('input[name="email"]').css("border-color", "#fff");
    }

    setVisibility(success, "#error_email_div");
    return success;
}
function validateDOB() {
    var success = true;
    var dobVal = $('input[name="dateOfBirth"]').val();
    var splitRegex = new RegExp(/[.\/ -]/);
    var dobArray = dobVal.split(splitRegex);

    var patternMonthDay = /\d{2}/;
    var patternYear = /\d{4}/

    var month = dobArray[0];
    var day = dobArray[1];
    var year = dobArray[2];

    if ( (dobArray.length > 3) || (!patternMonthDay.test(month)) || (!patternMonthDay.test(day)) || (!patternYear.test(year)) ){
        $('input[name="dateOfBirth"]').css("border-color", "red");
        success = false;
        setFocus('input[name="dateOfBirth"]');
        setVisibility(success, "#error_dob_div");
        return success;
    }

    var checkDate = new Date(year, month-1, day);
    var checkDay = checkDate.getDate();
    var checkMonth = checkDate.getMonth()+1;
    var checkYear = checkDate.getFullYear();

    if (day != checkDay || month != checkMonth || year != checkYear) {
        $('input[name="dateOfBirth"]').css("border-color", "red");
        setFocus('input[name="dateOfBirth"]');
        success = false;
    } else {
        $('input[name="dateOfBirth"]').css("border-color", "#fff");
    }
    setVisibility(success, "#error_dob_div");
    return success;
}
function validateGender() {
    var success = true;
    if ( (!($("#gender_radio_male").is(':checked'))) && (!($("#gender_radio_female").is(':checked'))) ) {
        $(".gender_row_container").css("border-color", "red");
        success = false;
    } else {
        $(".gender_row_container").css("border-color", "#fff");
    }
    setVisibility(success, "#error_gender_div");
    return success;
}
function validateExp() {
    var success = true;
    if ( !($("#exp_radio_novice").is(':checked')) && !($("#exp_radio_experienced").is(':checked')) && !($("#exp_radio_expert").is(':checked')) ) {
        for (i = 0; i <= 2; i++){
            $(flexRows[i]).css("border-color", "red");
        }
        success = false;
    } else {
        for (i = 0; i <= 2; i++){
            $(flexRows[i]).css("border-color", "#fff");
        }
    }
    setVisibility(success, "#error_exp_div");
    return success;
}
function validateAge() {
    var success = true;
    if ( !($("#age_radio_teen").is(':checked')) && !($("#age_radio_adult").is(':checked')) && !($("#age_radio_senior").is(':checked')) ) {
        for (i = 3; i <= 5; i++){
            $(flexRows[i]).css("border-color", "red");
        }
        success = false;
    } else {
        for (i = 3; i <= 5; i++){
            $(flexRows[i]).css("border-color", "#fff");
        }
    }
    setVisibility(success, "#error_age_div");
    return success;
}
