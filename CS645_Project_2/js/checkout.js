/*
* Nguyen, Thuc
* jadrn025
* Project #2
* Spring 2018
*/

var firstError = false;     // determines which elements need focus
var checkShipping = true;   // true if shipping address is different from billing
var listOfStates = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT","DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

var cart = new shopping_cart('jadrn025');

$(document).ready(function() {
    var cartSize = cart.size();
    $('#cart_quantity').text(cartSize);

    // Initially leave the shipping checkbox unchecked
    $('input[name="shippingCheckbox"]').prop("checked", false);

    $('input[name="shippingCheckbox"]').on('click', setCheckShipping);
    $(':submit').on("click", validateForm);
});

/*
* setCheckShipping() - If checked, disable shipping and clear the form and error messages.
*               If unchecked, allow form to valiate shipping section.
*/
function setCheckShipping() {
    if ($(this).prop("checked")) {
        disableShipping();
        checkShipping = false;
    } else {
        enableShipping();
        checkShipping = true;
    }
}
function enableShipping() {
    $("#shipping_address_div input").prop("disabled", false).css("border-color", "#FFF");
}
function disableShipping() {
    $("#shipping_address_div input").prop("disabled", true).css("border-color", "#FFF").each(function() {
        $(this).val("");
    });
    $("#shipping_address_div div[id^='error']").each(function() {
        setVisibility(true, this);
    });
}

/*
* validateForm() - Validate the form (name, address, phone number, payment type, card name,
*               card number, and expiration). Validate shipping section only if the checkbox
*               was unchecked, or checkShipping was true.
*/
function validateForm(event) {
    var success = true;

    if (!validateName('input[name="billFirstName"]', 'input[name="billLastName"]', "#error_bill_names_div")) {
        success = false;
    }
    if (!validateAddress('input[name="billAddress"]', 'input[name="billCity"]', 'input[name="billState"]', 'input[name="billZipCode"]', "#error_bill_address_div")) {
        success = false;
    }
    if (!validatePhoneNumber('input[name="billPhoneArea"]', 'input[name="billPhone3"]', 'input[name="billPhone4"]', "#error_bill_phone_div")) {
        success = false;
    }
    if (checkShipping) {
        if (!validateName('input[name="shipFirstName"]', 'input[name="shipLastName"]', "#error_ship_names_div")) {
            success = false;
        }
        if (!validateAddress('input[name="shipAddress"]', 'input[name="shipCity"]', 'input[name="shipState"]', 'input[name="shipZipCode"]', "#error_ship_address_div")) {
            success = false;
        }
        if (!validatePhoneNumber('input[name="shipPhoneArea"]', 'input[name="shipPhone3"]', 'input[name="shipPhone4"]', "#error_ship_phone_div")) {
            success = false;
        }
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

    return success;
}

/*
* Helper functions for validation
*
* setVisibility() - hides error message if validation successful, shows error message otherwise.
* setFocus() - focuses and scrolls to the first input in which validation failed.
* trim() - returns true if some character entered for input, false otherwise.
*/
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
        $(window).scrollTop($(selector).offset().top - 100);
        $(selector).focus();
        console.log("setFocus() - selector is " + selector);
    }
}
function trim(string) {
    var trimmed = $.trim(string);
    return (trimmed.length > 0);
}

/*=============================== Validation Functions ================================*/
function validateName(firstName, lastName, errorDiv) {
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

    setVisibility(success, errorDiv);
    return success;
}

function validateAddress(address, city, state, zipCode, errorDiv) {
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

function validatePhoneNumber(phoneArea, phone3, phone4, errorDiv) {
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
