/*
Nguyen, Thuc
jadrn041
Project #4
Fall 2017
*/

var firstError = false;     // determine which elements need focus
var checkShipping = false;  // true if shipping address is different from billing
var listOfStates = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT","DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH",
"OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]
var cart = new shopping_cart('jadrn041');

$(document).ready(function() {
    var cartSize = cart.size();
    $('#menu_cart a:nth-child(2)').text(cartSize);

    setEventListeners();
});

function setEventListeners() {
    $('input[name="shippingCheckbox"]').on('click', setCheckShipping);
    $(':submit').on("click", validateForm);
}

function setCheckShipping() {
    if ($(this).prop("checked")) {
        $('#shipping_address_div').css("display", "block");
        checkShipping = true;
    } else {
        $('#shipping_address_div').css("display", "none");
        checkShipping = false;
    }
}

// Validate the form
function validateForm(event) {
    var success = true;

    if (!validateName('input[name="billFirstName"]', 'input[name="billLastName"]', "#error_bill_names_div", checkShipping)) {
        success = false;
    }
    if (!validateAddress('input[name="billAddress"]', 'input[name="billCity"]', 'input[name="billState"]', 'input[name="billZipCode"]', "#error_bill_address_div", checkShipping)) {
        success = false;
    }
    if (!validatePhoneNumber('input[name="billPhoneArea"]', 'input[name="billPhone3"]', 'input[name="billPhone4"]', "#error_bill_phone_div", checkShipping)) {
        success = false;
    }
    if (!validatePaymentType()) {
        success = false;
    }
    if (!validateCardName()) {
        success = false;
    }
    if (!validateCardNumber()) {
        success = false;
    }
    if (!validateExpiration()) {
        success = false;
    }

    // Reset firstError back to false to reapply focus on next validation
    firstError = false;

    // If success is true, check for duplicates (AJAX)
    if (success){
        return true;
    } else {
        return false;
    }
}

// Helper functions for validation
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
function trim(string) {
    var trimmed = $.trim(string);
    return (trimmed.length > 0) ? true : false;
}

// Validation Functions
function validateName(firstName, lastName, errorDiv, checkShipping) {
    var success = true;

    var firstNameVal = $(firstName).val();
    var lastNameVal = $(lastName).val();

    if ( !(trim(firstNameVal)) ) {
        $(firstName).css("border-color", "red");
        setFocus(firstName);
        success = false;
    } else {
        $(firstName).css("border-color", "#fff");
    }
    if ( !(trim(lastNameVal)) ) {
        $(lastName).css("border-color", "red");
        setFocus(lastName);
        success = false;
    } else {
        $(lastName).css("border-color", "#fff");
    }

    // Call this function again if checkShipping is true
    if (checkShipping) {
        setVisibility(success, errorDiv);
        var shipSuccess = validateName('input[name="shipFirstName"]', 'input[name="shipLastName"]', '#error_ship_names_div', false);
        success = (success && shipSuccess) ? true : false;
        return success;
    }

    setVisibility(success, errorDiv);
    return success;
}
function validateAddress(address, city, state, zipCode, errorDiv, checkShipping) {
    var success = true;

    var addressVal = $(address).val();
    var cityVal = $(city).val();
    var stateVal = $(state).val();
    var zipCodeVal = $(zipCode).val();
    var patternZip = new RegExp(/^\d{5}$/);
    var patternState = new RegExp(/^[A-Z]{2}$/);

    if ( !(trim(addressVal)) ){
        $(address).css("border-color", "red");
        setFocus(address);
        success = false;
    } else {
        $(address).css("border-color", "#fff");
    }
    if ( !(trim(cityVal)) ){
        $(city).css("border-color", "red");
        setFocus(city);
        success = false;
    } else {
        $(city).css("border-color", "#fff");
    }
    if (!(trim(stateVal)) || !patternState.test(stateVal) || !checkIfState(stateVal) ) {
        $(state).css("border-color", "red");
        setFocus(state);
        success = false;
    } else {
        $(state).css("border-color", "#fff");
    }
    if ( !(patternZip.test(zipCodeVal)) ) {
        $(zipCode).css("border-color", "red");
        setFocus(zipCode);
        success = false;
    } else {
        $(zipCode).css("border-color", "#fff");
    }

    if (checkShipping) {
        setVisibility(success, errorDiv);
        var shipSuccess = validateAddress('input[name="shipAddress"]', 'input[name="shipCity"]', 'input[name="shipState"]', 'input[name="shipZipCode"]', "#error_ship_address_div", false);
        success = (success && shipSuccess) ? true : false;
        return success;
    }

    setVisibility(success, errorDiv);
    return success;
}
function checkIfState(stateVal) {
    var isState = false;
    for (i = 0; i < listOfStates.length; i++) {
        if (stateVal == listOfStates[i]) {
            isState = true
        }
    }
    return isState;
}

function validatePhoneNumber(phoneArea, phone3, phone4, errorDiv, checkShipping) {
    var success = true;

    var phoneAreaVal = $(phoneArea).val();
    var phone3Val = $(phone3).val();
    var phone4Val = $(phone4).val();
    var patternArea3 = new RegExp(/^[2-9]{1}\d{2}$/);
    var pattern4 = new RegExp(/^\d{4}$/);

    if ( (!patternArea3.test(phoneAreaVal)) || (!patternArea3.test(phone3Val)) || (!pattern4.test(phone4Val)) ){
        $(phoneArea).css("border-color", "red");
        $(phone3).css("border-color", "red");
        $(phone4).css("border-color", "red");
        setFocus(phoneArea);
        success = false;
    } else {
        $(phoneArea).css("border-color", "#fff");
        $(phone3).css("border-color", "#fff");
        $(phone4).css("border-color", "#fff");
    }

    if (checkShipping) {
        setVisibility(success, errorDiv);
        var shipSuccess = validatePhoneNumber('input[name="shipPhoneArea"]', 'input[name="shipPhone3"]', 'input[name="shipPhone4"]', "#error_ship_phone_div", false);
        success = (success && shipSuccess) ? true : false;
        return success;
    }

    setVisibility(success, errorDiv);
    return success;
}

function validatePaymentType() {
    var success = true;

    if ( !($('#radio_visa').is(':checked')) &&  !($('#radio_mastercard').is(':checked')) && !($('#radio_discover').is(':checked')) && !($('#radio_american_express').is(':checked')) ) {
        $('#cards_div').css("border-color", "red");
        success = false;
    } else {
        $('#cards_div').css("border-color", "#fff");
    }
    setVisibility(success, '#error_payment_type_div');
    return success;
}

function validateCardName() {
    var success = true;

    var nameVal = $('input[name="cardName"]').val();

    if (!trim(nameVal)) {
        $('input[name="cardName"]').css("border-color", "red");
        setFocus('input[name="cardName"]');
        success = false;
    } else {
        $('input[name="cardName"]').css("border-color", "#fff");
    }

    setVisibility(success, '#error_card_name_div');
    return success;
}
function validateCardNumber() {
    var success = true;

    var numberVal = $('input[name="cardNumber"]').val();
    var pattern = new RegExp(/^\d{16}$/);

    if ( !trim(numberVal) || !(pattern.test(numberVal)) ) {
        $('input[name="cardNumber"]').css("border-color", "red");
        setFocus('input[name="cardNumber"]');
        success = false;
    } else {
        $('input[name="cardNumber"]').css("border-color", "#fff");
    }

    setVisibility(success, '#error_card_number_div');
    return success;
}

function validateExpiration() {
    var success = true;

    var monthVal = $('input[name="expMonth"]').val();
    var yearVal = $('input[name="expYear"]').val();
    var cvcVal = $('input[name="expCVC"]').val();
    var patternMonth = new RegExp(/^[0-1][0-9]$/);
    var patternYear = new RegExp(/^\d{4}$/);
    var patternCVC = new RegExp(/^\d{3}$/);
    var dateNow = new Date();

    // alert("date is month: " + (dateNow.getMonth() + 1) + " year: " + dateNow.getFullYear());

    if ( (!trim(monthVal)) || (!patternMonth.test(monthVal)) || (parseInt(monthVal, 10) > 12) ) {
        $('input[name="expMonth"]').css("border-color", "red");
        setFocus('input[name="expMonth"]');
        success = false;
    } else {
        $('input[name="expMonth"]').css("border-color", "#fff");
    }

    if ( !trim(yearVal) || (!patternYear.test(yearVal)) || (parseInt(yearVal, 10) < dateNow.getFullYear()) ) {
        $('input[name="expYear"]').css("border-color", "red");
        setFocus('input[name="expYear"]');
        success = false;
    } else {
        $('input[name="expYear"]').css("border-color", "#fff");
    }

    // Check that month and year is valid
    if (success) {
        if ( (parseInt(yearVal, 10) == dateNow.getFullYear()) && (parseInt(monthVal, 10) < (dateNow.getMonth()+1)) ) {
            $('input[name="expMonth"]').css("border-color", "red");
            $('input[name="expYear"]').css("border-color", "red");
            setFocus('input[name="expMonth"]');
            success = false;
        } else {
            $('input[name="expMonth"]').css("border-color", "#fff");
            $('input[name="expYear"]').css("border-color", "#fff");
        }
    }

    if ( !trim(cvcVal) || !patternCVC.test(cvcVal) ) {
        $('input[name="expCVC"]').css("border-color", "red");
        setFocus('input[name="expCVC"]');
        success = false;
    } else {
        $('input[name="expCVC"]').css("border-color", "#fff");
    }

    setVisibility(success, '#error_expiration_div');
    return success;
}
