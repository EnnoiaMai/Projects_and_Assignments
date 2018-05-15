/*
Thuc Nguyen
jadrn025
Project #1
Spring 2018
*/

/*==============================================================================
New Inventory Tab
Submit -> validate form -> check for duplicates -> serialize and submit

Edit Inventory Tab
Enter SKU -> retrieve product information and populate page
Save Changes -> validate form -> serialize and submit

Delete Inventory Tab
Enter SKU -> retrieve product information and populate page
Delete -> serialize and submit (sku is set to script)
==============================================================================*/

/* PLACEHOLDERS */
var descriptionPlaceholder = "Short description of the item...";
var featuresPlaceholder = "Detailed description of the item...";

/* VALIDATION */
var firstError = false;         // focuses input element
var buttonsDisabled = false;    // enable/disable the buttons
var size;                       // image file size
var shouldValidateImage = false;    // whether or not to validate the image

/* ENUM TABS */
var InventoryTabs = {
    NEW_INVENTORY: "new_inventory",
    EDIT_INVENTORY: "edit_inventory",
    DELETE_INVENTORY: "delete_inventory"
};
var currentInventoryTab = InventoryTabs.NEW_INVENTORY;

$(document).ready(function() {
    // Check history cache
    // window.onpopstate = function(event) {
    //     console.log("menu onpopstate()");
    //     historyStateObject = event.state;
    //     historyStateObject.push("/perl/jadrn025/signin.cgi");
    // };

    $('#logout_div a').on('click', function(event) {
        event.preventDefault();
        location.replace("/perl/jadrn025/logout.cgi");
    });

    window.addEventListener("pageshow", function(event) {
        console.log("pageShow");
        var pageCached = event.persisted || (typeof window.performance != "undefined" && window.performance.navigation.type === 2);
        if (pageCached) {
            console.log("The page was cached, it will be refreshed.");
            window.location.reload(true);
        }
    });

    $("#tabs").tabs({
        active: 0
    });

    // Tabs Click Event
    $('a[href="#new_inventory_tab"]').on('click', updateCurrentInventoryTab);
    $('a[href="#edit_inventory_tab"]').on('click', updateCurrentInventoryTab);
    $('a[href="#delete_inventory_tab"]').on('click', updateCurrentInventoryTab);

    $('form[name="newProductForm"] input[name="sku"]').focus();

    // Blur event for edit and delete sku inputs
    $('.sku_container input').on('blur', getProductInfo);
    $('.sku_container input').val('');

    // Focus event for edit and delete sku inputs, clear forms if buttonsDisabled is false
    $('form[name="editProductForm"] input[name="sku"]').on('focus', function() {
        $(this).val('');
        $(this).css("border-color", "#AAA");
        $('#error_edit_sku_div').css("visibility", "hidden");

        if (buttonsDisabled) {
            return;
        }
        buttonsDisabled = true;
        editFormFullClear();
    });
    $('form[name="deleteProductForm"] input[name="sku"]').on('focus', function() {
        $(this).val('');
        $(this).css("border-color", "#AAA");
        $('#error_delete_sku_div').css("visibility", "hidden");

        if (buttonsDisabled) {
            return;
        }
        buttonsDisabled = true;
        deleteFormFullClear();
    });

    // Image Preview
    $('form[name="newProductForm"] input[name="productImage"]').on("change", function(event){
        var fileHandle = this.files[0];
        size = fileHandle.size;
        var fileObj = URL.createObjectURL(fileHandle);
        $("#new_image_preview").attr("src", fileObj).show();
    });
    $('form[name="editProductForm"] input[name="productImage"]').on("change", function(event){
        var fileHandle = this.files[0];
        size = fileHandle.size;
        var fileObj = URL.createObjectURL(fileHandle);
        $("#edit_image_preview").attr("src", fileObj).show();
    });

    // Clear entire form including error messages when reset is clicked
    $(':reset').on("click", function() {
        $("#new_image_preview").hide();
        newFormFullClear();
    });

    // New, Edit, Delete Inventory Submit button
    $('button[name="newSubmitButton"]').on('click', validateForm);
    $('button[name="editSubmitButton"]').on('click', function() {
        // If image file exists, change shouldValidateImage accordingly
        if ($('#edit_product_image').get(0).files.length === 0) {
            shouldValidateImage = false;
        } else {
            shouldValidateImage = true;
        }
        validateForm();
    });
    $('button[name="deleteSubmitButton"]').on('click', deleteProduct);
});

function updateCurrentInventoryTab() {
    switch ($(this).attr("href")) {
        case "#new_inventory_tab":
            currentInventoryTab = InventoryTabs.NEW_INVENTORY;
            $('form[name="newProductForm"] input[name="sku"]').focus();

            buttonsDisabled = false;
            resetTab('form[name="newProductForm"]');
            break;
        case "#edit_inventory_tab":
            currentInventoryTab = InventoryTabs.EDIT_INVENTORY;
            $('#edit_enter_sku').focus().val('');

            buttonsDisabled = true;
            disableForm('#edit_inventory_content input:not("#edit_enter_sku"), #edit_inventory_content select, #edit_inventory_content textarea', true);
            disableButtons('#edit_inventory_content button', true);

            resetTab('form[name="editProductForm"]');
            break;
        case "#delete_inventory_tab":
            currentInventoryTab = InventoryTabs.DELETE_INVENTORY;
            $('#delete_enter_sku').focus().val('');

            buttonsDisabled = true;
            disableButtons('#delete_inventory_content button', true);

            resetTab('form[name="deleteProductForm"]');
            break;
        default:
            break;
    }
}

/*================================ BUSYWAIT ==================================*/
function displayBusywait() {
    $('#busywait_container').css("z-index", "10");
}
function hideBusywait() {
    $('#busywait_container').css("z-index", "-10");
}

/*============================== NEW INVENTORY ===============================*/
/*
    Check for duplicates before adding the new product to the inventory
*/
function checkForDuplicates() {
    console.log("checkForDuplicates()");

    var sku = $('form[name="newProductForm"] input[name="sku"]').val();
    var url = "/perl/jadrn025/check_for_duplicates.cgi?sku=" + sku;
    $.get(url, checkForDuplicatesHandler);

    displayBusywait();
}
function checkForDuplicatesHandler(response) {
    console.log("checkForDuplicatesHandler() " + response);

    if (response == "ok") {
        // Serialize and submit information
        var urlPath = "/perl/jadrn025/modify_products.cgi";
        // var serializedData = $('form[name="newProductForm"]').serialize() + '&' + $.param({'productForm':'new'});
        // $.post(url, serializedData, addedProduct);

        var formData = new FormData();
        var serializedData = $('form[name="newProductForm"]').serializeArray();
        var fileHandle = $('form[name="newProductForm"] input[name="productImage"]')[0].files[0];
        formData.append('productImage', fileHandle);
        formData.append('productForm', 'new');
        $.each(serializedData, function(key, input) {
            formData.append(input.name, input.value);
        });
        $.ajax({
            url: urlPath,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log("AJAX call to add new product was successful");
                hideBusywait();

                if (response == "ok") {
                    // Show confirmation that product was added
                    toggleConfirmation('#new_inventory_confirmation', true, 'The new product has been successfully added as a record.');
                    newFormFullClear();
                    $('form[name="newProductForm"] input[name="sku"]').focus();
                }
                else {
                    // Error in the script/server-side
                    toggleConfirmation('#new_inventory_confirmation', false, 'There was an error when processing the product to be added.');
                }
            },
            error: function(response) {
                console.log("AJAX call to add new product returned an error: " + response);
                hideBusywait();

                toggleConfirmation('#new_inventory_confirmation', false, 'There was an error when processing the product to be added.');
            }
        });
    }
    else if (response == "duplicate") {
        hideBusywait();

        // Return error and that sku already exists
        toggleConfirmation('#new_inventory_confirmation', false, 'The SKU already exists. Enter a different SKU or navigate to Edit Inventory to edit the product associated with the SKU.');
        $('form[name="newProductForm"] input[name="sku"]').focus();
    }
    else {
        hideBusywait();

        // Error in the script/server-side
        toggleConfirmation('#new_inventory_confirmation', false, 'There was an error when validating the product to be added.');
    }
}

/*=========================== EDIT/DELETE INVENTORY ==========================*/
/*
    Called on blue of enter sku from Edit/Delete tabs.
    Runs the script to get back the product information
*/
function getProductInfo() {
    console.log("getProductInfo()");

    var skuVal = null;
    var url = null;
    switch (currentInventoryTab) {
        case InventoryTabs.EDIT_INVENTORY:
            if (!validateSKU('form[name="editProductForm"] input[name="sku"]', '#error_edit_sku_div')) {
                console.log("sku validated false");
                $('#error_edit_sku_div').text('Enter the 6-character SKU separated by a dash.');
                return;
            }

            skuVal = $('form[name="editProductForm"] input[name="sku"]').val();
            url = "/perl/jadrn025/get_product.cgi" + "?sku=" + skuVal;
            console.log("url is " + url);
            $.get(url, getProductInfoEditHandler);
            break;
        case InventoryTabs.DELETE_INVENTORY:
            if (!validateSKU('form[name="deleteProductForm"] input[name="sku"]', '#error_delete_sku_div')) {
                console.log("sku validated false");
                $('#error_delete_sku_div').text('Enter the 6-character SKU separated by a dash.');
                return;
            }

            skuVal = $('form[name="deleteProductForm"] input[name="sku"]').val();
            url = "/perl/jadrn025/get_product.cgi" + "?sku=" + skuVal;
            console.log("url is " + url);
            $.get(url, getProductInfoDeleteHandler);
            break;
        default:
            break;
    }
}

/*============================== EDIT INVENTORY ==============================*/
function getProductInfoEditHandler(response) {
    console.log("getProductInfoEditHandler() " + response);

    if (response == "invalid"){
        $('#error_edit_sku_div').css("visibility", "visible").text('The SKU entered does not exist.');
        $('form[name="editProductForm"] input[name="sku"]').css("border-color", "red");
        return;
    }

    buttonsDisabled = false;
    disableForm('#edit_inventory_content input:not("#edit_enter_sku"), #edit_inventory_content select, #edit_inventory_content textarea', false);
    disableButtons('#edit_inventory_content button', false);

    var record = response.split('|');

    $('form[name="editProductForm"] input[name="manufacturerID"]').val(record[0]).focus();

    $('form[name="editProductForm"] select[name="category"] > option').each(function() {
        if ($(this).text() == record[1]) {
            $(this).closest('select').val($(this).val());
        }
    });

    $('form[name="editProductForm"] select[name="vendor"] > option').each(function() {
        if ($(this).text() == record[2]) {
            $(this).closest('select').val($(this).val());
        }
    });

    $('form[name="editProductForm"] textarea[name="description"]').val(record[3]);
    $('form[name="editProductForm"] textarea[name="features"]').val(record[4]);
    $('form[name="editProductForm"] input[name="cost"]').val(record[5]);
    $('form[name="editProductForm"] input[name="retail"]').val(record[6]);
    $('form[name="editProductForm"] input[name="quantity"]').val(record[7]);
    $('form[name="editProductForm"] img').attr("src", "/~jadrn025/proj1/product_images/" + record[8]).show();
}

/* Called on click of save changes from Edit tab */
function editProduct() {
    console.log("editProduct()\nsku = " + $('form[name="editProductForm"] input[name="sku"]').val() +
        "\nmanID = " + $('form[name="editProductForm"] input[name="manufacturerID"]').val() +
        "\ncategory = " + $('form[name="editProductForm"] select[name="category"]').val() +
        "\nvendor = " + $('form[name="editProductForm"] select[name="vendor"]').val() +
        "\ndescription = " + $('form[name="editProductForm"] textarea[name="description"]').val() +
        "\nfeatures = " + $('form[name="editProductForm"] textarea[name="features"]').val() +
        "\ncost = " + $('form[name="editProductForm"] input[name="cost"]').val() +
        "\nretail = " + $('form[name="editProductForm"] input[name="retail"]').val() +
        "\nquantity = " + $('form[name="editProductForm"] input[name="quantity"]').val());

    var urlPath = "/perl/jadrn025/modify_products.cgi";
    // var serializedData = $('form[name="editProductForm"]').serialize() + '&' + $.param({'productForm':'edit'});
    // $.post(url, serializedData, editProductHandler);

    var formData = new FormData();
    var serializedData = $('form[name="editProductForm"]').serializeArray();
    var fileHandle = $('form[name="editProductForm"] input[name="productImage"]')[0].files[0];
    if (!fileHandle) {
        fileHandle = "undefined";
    }
    console.log("filehandle is: " + fileHandle);
    formData.append('productImage', fileHandle);
    formData.append('productForm', 'edit');
    $.each(serializedData, function(key, input) {
        formData.append(input.name, input.value);
        console.log(input.name + " : " + input.value);
    });

    displayBusywait();

    $.ajax({
        url: urlPath,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log("AJAX call to edit product was successful");
            hideBusywait();

            // Display confirmation that product was edited
            if (response == "ok") {
                toggleConfirmation('#edit_inventory_confirmation', true, 'The product has been successfully edited and saved.');
                buttonsDisabled = true;
                editFormFullClear();
                $('form[name="editProductForm"] input[name="sku"]').focus();
            }
            else {
                toggleConfirmation('#edit_inventory_confirmation', false, 'There was an error when processing the product to be edited.');
            }
        },
        error: function(response) {
            console.log("AJAX call to edit product returned an error: " + response);
            hideBusywait();

            toggleConfirmation('#edit_inventory_confirmation', false, 'There was an error when processing the product to be edited.');
        }
    });
}

/*============================= DELETE INVENTORY =============================*/
function getProductInfoDeleteHandler(response) {
    console.log("getProductInfoDeleteHandler() " + response);

    if (response == "invalid"){
        $('#error_delete_sku_div').css("visibility", "visible").text('The SKU entered does not exist.');
        $('form[name="deleteProductForm"] input[name="sku"]').css("border-color", "red");
        return;
    }

    buttonsDisabled = false;
    disableButtons('#delete_inventory_content button', false);

    var record = response.split('|');
    $('#delete_manufacturer_ID').text(record[0]);
    $('#delete_category').text(record[1]);
    $('#delete_vendor').text(record[2]);
    $('#delete_description').text(record[3]);
    $('#delete_features').text(record[4]);
    $('#delete_cost').text(record[5]);
    $('#delete_retail').text(record[6]);
    $('#delete_quantity').text(record[7]);
    $('#delete_image_preview').attr("src", "/~jadrn025/proj1/product_images/" + record[8]).show();
}

/* Called on click of delete from Delete tab */
function deleteProduct() {
    console.log("deleteProduct()");

    if (buttonsDisabled) {
        console.log("buttonsDisabled is true, can't validate");
        return;
    }

    if (!validateSKU('form[name="deleteProductForm"] input[name="sku"]', '#error_delete_sku_div')) {
        console.log("validated false");
        return;
    }
    var url = "/perl/jadrn025/modify_products.cgi";
    var serializedData = $('form[name="deleteProductForm"]').serialize() + '&' + $.param({'productForm':'delete'});
    $.post(url, serializedData, deleteProductHandler);

    displayBusywait();
}
function deleteProductHandler(response) {
    console.log("deleteProductHandler() " + response);
    hideBusywait();

    // Display confirmation that product was deleted
    if (response == "ok") {
        toggleConfirmation('#delete_inventory_confirmation', true, 'The product has been sucessfully deleted.');
        buttonsDisabled = true;
        deleteFormFullClear();
        $('form[name="deleteProductForm"] input[name="sku"]').focus();
    }
    else {
        toggleConfirmation('#delete_inventory_confirmation', false, 'There was an error when processing the product to be deleted.');
    }
}

/*================================ VALIDATION ================================*/
function validateForm() {
    console.log("validateForm()");

    if (buttonsDisabled) {
        console.log("buttonsDisabled is true, can't validate");
        return;
    }

    var success = true;
    var sku = 'input[name="sku"]';
    var manufacturerID = 'input[name="manufacturerID"]';
    var category = 'select[name="category"]';
    var vendor = 'select[name="vendor"]';
    var description = 'textarea[name="description"]';
    var features = 'textarea[name="features"]';
    var cost = 'input[name="cost"]';
    var retail = 'input[name="retail"]';
    var quantity = 'input[name="quantity"]';
    var image = 'input[name="productImage"]';

    var errorSku = "sku_div";
    var errorManufacturerID = "manufacturer_div";
    var errorCategory = "category_div";
    var errorVendor = "vendor_div";
    var errorDescription = "description_div";
    var errorFeatures = "features_div";
    var errorCost = "cost_div";
    var errorRetail = "retail_div";
    var errorQuantity = "quantity_div";
    var errorImage = "image_div";

    var prefix;
    var errorPrefix;
    switch (currentInventoryTab) {
        case InventoryTabs.NEW_INVENTORY:
            prefix = 'form[name="newProductForm"] ';
            errorPrefix = "#error_new_";
            break;
        case InventoryTabs.EDIT_INVENTORY:
            prefix = 'form[name="editProductForm"] ';
            errorPrefix = "#error_edit_";
            break;
        default:
            return;
    }

    if ( !validateSKU((prefix + sku), (errorPrefix + errorSku)) ) {
        success = false;
    }
    if ( !validateManufacturersID((prefix + manufacturerID), (errorPrefix + errorManufacturerID)) ) {
        success = false;
    }
    if ( !validateSelect((prefix + category), (errorPrefix + errorCategory)) ) {
        success = false;
    }
    if ( !validateSelect((prefix + vendor), (errorPrefix + errorVendor)) ) {
        success = false;
    }
    if ( !validateTextarea((prefix + description), (errorPrefix + errorDescription)) ) {
        success = false;
    }
    if ( !validateTextarea((prefix + features), (errorPrefix + errorFeatures)) ) {
        success = false;
    }
    if ( !validateCostRetailQuantity((prefix + cost), (prefix + retail), (prefix + quantity), (errorPrefix + errorCost), (errorPrefix + errorRetail), (errorPrefix + errorQuantity)) ) {
        success = false;
    }
    if (currentInventoryTab == InventoryTabs.NEW_INVENTORY) {
        if ( !validateProductImage((prefix + image), (errorPrefix + errorImage)) ) {
            success = false;
        }
    } else {
        if (shouldValidateImage) {
            if ( !validateProductImage((prefix + image), (errorPrefix + errorImage)) ) {
                success = false;
            }
        }
    }
    firstError = false;

    console.log("Validating form success returned " + success);
    if (!success) {
        return;
    }
    switch (currentInventoryTab) {
        case InventoryTabs.NEW_INVENTORY:
            checkForDuplicates();
            break;
        case InventoryTabs.EDIT_INVENTORY:
            editProduct();
            break;
        default:
            break;
    }
}

/*------------------------ VALIDATION HELPER METHODS -------------------------*/
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
        $(window).scrollTop($(selector).position().top);
    }
}
function trim(string) {
    var trimmed = $.trim(string);
    return (trimmed.length > 0) ? true : false;
}

/*--------------------------- VALIDATION METHODS -----------------------------*/
function validateSKU(selector, errorSelector) {
    var success = true;
    var skuVal = $(selector).val();
    var pattern = new RegExp(/^[A-Z]{3}[-][0-9]{3}$/);

    if (!pattern.test(skuVal)) {
        $(selector).css("border-color", "red");
        setFocus(selector);
        success = false;
    } else {
        $(selector).css("border-color", "#EEE");
    }

    setVisibility(success, errorSelector);
    return success;
}

function validateManufacturersID(selector, errorSelector) {
    var success = true;
    var manufacturerIDVal = $(selector).val();

    if (!trim(manufacturerIDVal)) {
        $(selector).css("border-color", "red");
        setFocus(selector);
        success = false;
    } else {
        $(selector).css("border-color", "#EEE");
    }
    setVisibility(success, errorSelector);
    return success;
}

function validateSelect(selector, errorSelector) {
    var success = true;
    var value = $(selector).val();

    if (value == "null") {
        $(selector).closest('div').css("border-color", "red");
        setFocus(selector);
        success = false;
    } else {
        $(selector).closest('div').css("border-color", "#EEE");
    }
    setVisibility(success, errorSelector);
    return success;
}

function validateTextarea(selector, errorSelector) {
    var success = true;
    var value = $(selector).val();

    if (!trim(value)) {
        $(selector).css("border-color", "red");
        setFocus(selector);
        success = false;
    } else {
        $(selector).css("border-color", "#EEE");
    }

    setVisibility(success, errorSelector);
    return success;
}

function validateCostRetailQuantity(cost, retail, quantity, errorCost, errorRetail, errorQuantity) {
    // cost retail and quantity success done separately for the
    // setVisibility function to be applied for each individual input
    var success = true;
    var costSuccess = true;
    var retailSuccess = true;
    var quantitySuccess = true;

    var costVal = $(cost).val();
    var retailVal = $(retail).val();
    var quantityVal = $(quantity).val();

    var currencyAndRetailPattern = new RegExp(/^\d*(\.\d{0,2})?$/);
    var quantityPattern = new RegExp(/^\d*$/);

    if (!trim(costVal) || !currencyAndRetailPattern.test(costVal)) {
        $(cost).css("border-color", "red");
        setFocus(cost);
        costSuccess = false;
    } else {
        $(cost).css("border-color", "#EEE");
    }
    setVisibility(costSuccess, errorCost);

    if (!trim(retailVal) || !currencyAndRetailPattern.test(retailVal)) {
        $(retail).css("border-color", "red")
        setFocus(retail);
        retailSuccess = false;
    } else {
        $(retail).css("border-color", "#EEE")
    }
    setVisibility(retailSuccess, errorRetail);

    if (!trim(quantityVal) || !quantityPattern.test(quantityVal)) {
        $(quantity).css("border-color", "red");
        setFocus(quantity);
        quantitySuccess = false;
    } else {
        $(quantity).css("border-color", "#EEE");
    }
    setVisibility(quantitySuccess, errorQuantity);

    if (!costSuccess || !retailSuccess || !quantitySuccess) {
        success = false;
    }
    return success;
}

function validateProductImage(selector, errorSelector) {
    var success = true;
    if ( (size == 0) || ($(selector).get(0).files.length === 0) ) {
        $(selector).closest('div').css("border-color", "red");
        $(errorSelector + ' p').text("Select an image file to upload.");
        success = false;
        setFocus(selector);
        setVisibility(success, errorSelector);
        return success;
    }
    if ((size / 1000) > 3000) {
        $(selector).closest('div').css("border-color", "red");
        $(errorSelector + ' p').text("The image file must be less than 3MB.");
        setFocus(selector);
        success = false;
    } else {
        $(selector).closest('div').css("border-color", "#EEE");
    }
    setVisibility(success, errorSelector);
    return success;
}

/*=============================== CONFIRMATION ===============================*/
function toggleConfirmation(selector, didSucceed, text) {
    console.log("toggleConfirmation() - " + didSucceed);

    $(selector + ' p').text(text);
    // Show confirmation for 7 seconds before removing it
    if (didSucceed) {
        $(selector + ' img').prop('src', '../images/check_transparent.png');
        $(selector).addClass('confirmation_success').css('display', 'flex').fadeIn(1000);
        window.setTimeout(function() {
            $(selector).css('display', 'none').removeClass('confirmation_success').fadeOut(1000);
        }, 7000);
    } else {
        $(selector + ' img').prop('src', '../images/error_transparent.png');
        $(selector).addClass('confirmation_error').css('display', 'flex').fadeIn(1000);
        window.setTimeout(function() {
            $(selector).css('display', 'none').removeClass('confirmation_error').fadeOut(1000);
        }, 7000);
    }
    $(window).scrollTop($(selector).position().top);
}

/*========================== DISABLE FORM/RESET TAB ==========================*/
function disableForm(elementsToDisable, isDisabled) {
    console.log("disableForm() - " + isDisabled);

    $(elementsToDisable).prop("disabled", isDisabled);
    if (isDisabled) {
        $(elementsToDisable).css({
            "background-color": "#AAA",
            "border": "1px solid #AAA"
        });
    } else {
        $(elementsToDisable).css({
            "background-color": "#EEE",
            "border": "1px solid #EEE"
        });
    }
}

function clearValidation(elementsToClear, formDisabled) {
    if (formDisabled) {
        $(elementsToClear).css("border-color", "#AAA");
    } else {
        $(elementsToClear).css("border-color", "#EEE");
    }
}
function clearValidationSelect(elementsToClear, formDisabled) {
    if (formDisabled) {
        $(elementsToClear).closest('div').css("border-color", "#AAA");
    } else {
        $(elementsToClear).closest('div').css("border-color", "#EEE");
    }
}

function disableButtons(elementsToDisable, isDisabled) {
    console.log("disableButton() - " + isDisabled);

    if (isDisabled) {
        // Disable the buttons
        $(elementsToDisable).removeClass('enable_buttons_submit');
    } else {
        // Enable the buttons
        $(elementsToDisable).addClass('enable_buttons_submit');
    }
}

function resetTab(formSelector) {
    console.log("resetTab " + formSelector);
    // Disable the form of edit or delete tab, and clear the inputs if new or edit tab
    if (currentInventoryTab != InventoryTabs.NEW_INVENTORY) {
        newFormFullClear();
    }
    if (currentInventoryTab != InventoryTabs.EDIT_INVENTORY) {
        editFormFullClear();
    }
    if (currentInventoryTab != InventoryTabs.DELETE_INVENTORY) {
        deleteFormFullClear();
    }

    // Hide the errors
    $(formSelector + ' div[id^="error"][id$="div"]').css("visibility", "hidden");
}

/*================================ FULL CLEAR ================================*/
function newFormFullClear() {
    console.log("newFormFullClear()");

    clearValidation('#new_inventory_tab input:not(#new_reset_button), #new_inventory_tab textarea', false);
    clearValidationSelect('#new_inventory_tab select', false);

    $('#new_inventory_tab input:not(#new_reset_button), #new_inventory_tab textarea').val('');
    $('#new_inventory_tab select').val('null');
    $('#new_image_preview').attr("src", "").hide();

    $('form[name="newProductForm"] div[id^="error"][id$="div"]').css("visibility", "hidden");
}

function editFormFullClear() {
    console.log("editFormFullClear()");

    disableForm('#edit_inventory_content input:not("#edit_enter_sku"), #edit_inventory_content select, #edit_inventory_content textarea', true);
    disableButtons('#edit_inventory_content button', true);
    clearValidation('#edit_enter_sku', false);
    clearValidationSelect('#edit_inventory_content select', true);

    $('#edit_inventory_content input, #edit_inventory_content textarea').val('');
    $('#edit_inventory_content select').val('null');
    $('#edit_image_preview').attr("src", "").hide();

    $('form[name="editProductForm"] div[id^="error"][id$="div"]').css("visibility", "hidden");
}

function deleteFormFullClear() {
    console.log("deleteFormFullClear()");

    disableButtons('#delete_inventory_content button', true);
    clearValidation('#delete_inventory_content input[name="sku"]');

    $('#delete_inventory_content input').val('');
    $('#delete_manufacturer_ID, #delete_category, #delete_vendor, #delete_description, #delete_features, #delete_cost, #delete_retail, #delete_quantity').text('');
    $('#delete_image_preview').attr("src", "").hide();

    $('form[name="deleteProductForm"] div[id^="error"][id$="div"]').css("visibility", "hidden");
}
