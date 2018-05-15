/*
* Nguyen, Thuc
* jadrn025
* Project #2
* Spring 2018
*/

/*
Based off of Prof. Riggin's code
A class that analyzes cookies and alters its String value which represents
the product sku and quantity to be sent to the server.

Methods:
    // Creates a new cart using cookies, parameter is jadrn number
    var cart = new shopping_cart("jadrn025");

    // Adds new entry/increments quantity if entry exists
    cart.add(sku, quantity);

    // Changes quantity of sku to new value
    cart.setQuantity(sku, quantity);

    // Deletes the sku from the cart, and essentially the cookie
    cart.delete(sku);

    // Returns size of cart
    cart.size();

    // Returns 2D array of sku=quantity pairs. array[sku][quantity]
    cart.getCartArray();
*/

/*
    Reads the value of the cookie if it exists, and splits it out to put it into
    the parallel arrays skuArray and qtyArray. If cookie doesn't exist, simply
    returns.
*/
function shopping_cart(owner) {
    this.owner = $.trim(owner);
    // Parallel arrays for the 2D array, acts as the shopping cart
    this.skuArray = new Array();
    this.qtyArray = new Array();

    /*------------------------------ PRIVATE ---------------------------------*/
    /*
        Parses out the value in the cookie named 'jadrn025' so that the shopping
        cart can be updated with what was written to the cookie before.
    */
    this.getCookieValues = function() {
        // Grab all the cookies which will return string "key=value; key=value;..."
        // Check if any cookies at all exist, if not then return
        var rawString = document.cookie;
        if (rawString == undefined) {
            return;
        }

        // Split the cookies to an array of individual cookies
        var tmp = rawString.split(";");

        // Search for cookie 'jadrn025', else return
        var myValue = null;
        for (i = 0; i < tmp.length; i++) {
            if (tmp[i].indexOf(owner) != -1) {
                // Split to get array [name, value]
                myValue = tmp[i].split("=");
            }
        }
        if (!myValue) {
            return;
        }

        // Get the value of cookie and split it to get array ["sku"|"quantity", ...]
        var arr = new Array();
        arr = myValue[1].split("||");
        for (i = 0; i < arr.length; i++) {
            // Then split that to get array [sku, quantity]
            var pair = arr[i].split("|");
            if (pair[0] == undefined || pair[1] == undefined) {
                continue;
            }
            this.skuArray[i] = pair[0];
            this.qtyArray[i] = pair[1];
        }
    }

    /*
        Creates a new cookie by using name of owner 'jadrn025' and concatenating
        the sku and quantity to serialize it to look like
        sku|quantity||sku|quantity
    */
    this.writeCookie = function() {
        var toWrite = this.owner + "=";
        for (i = 0; i < this.skuArray.length; i++) {
            toWrite += this.skuArray[i] + "|" + this.qtyArray[i] + "||";
        }
        // Removes the extra || separator, and add a semicolon and path attribute
        toWrite = toWrite.substring(0, toWrite.length - 2);
        toWrite += "; path=/";
        document.cookie = toWrite;
    }
    /*------------------------------------------------------------------------*/

    this.add = function(sku, quantity) {
        sku = $.trim(sku);
        quantity = $.trim(quantity);

        // Uses cookie to get and update the shopping cart
        this.getCookieValues();

        /* Parses the string, adds the new quantity to the existing quantity if
            the sku is already part of the skuArray. If not, appends the
            sku and quantity to their appropriate arrays */
        var found = false;
        for (var i = 0; i < this.skuArray.length; i++) {
            if (this.skuArray[i] == sku) {
                this.qtyArray[i] = parseInt(quantity, 10) + parseInt(this.qtyArray[i], 10);
                found = true;
            }
        }
        if (!found) {
            this.skuArray.push(sku);
            this.qtyArray.push(quantity);
        }

        // Overwrite the existing cookie
        this.writeCookie();
    }

    this.setQuantity = function(sku, quantity) {
        sku = $.trim(sku);
        if (sku == "") {
            return;
        }
        quantity = $.trim(quantity);

        // Uses cookie to get and update the shopping cart
        this.getCookieValues();

        /* Parses the string, sets the quantity of the sku if it exists in the
            skuArray. If not, call add. */
        var found = false;
        for (i = 0; i < this.skuArray.length; i++) {
            if (this.skuArray[i] == sku) {
                this.qtyArray[i] = parseInt(quantity, 10);
                found = true;
            }
        }

        // Overwrite the existing cookie if the sku is found
        if (found) {
            this.writeCookie();
        } else {
            this.add(sku, quantity);
        }
    }

    this.delete = function(sku) {
        sku = $.trim(sku);

        // Get the index of the sku to be deleted
        var index = -1;
        this.getCookieValues();
        for (i = 0; i < this.skuArray.length; i++) {
            if (this.skuArray[i] == sku) {
                index = i;
            }
        }
        // If it exists, delete that item by splicing
        if (index != -1) {
            this.skuArray.splice(index, 1);
            this.qtyArray.splice(index, 1);
        }
        // If there is nothing in the cart, delete the cookie. If there is an
        // item after deletion, then write the cookie.
        if (this.skuArray.length == 0) {
            document.cookie = this.owner + "= ;expires=-1;path=/";
        }
        else {
            this.writeCookie();
        }
    }

    this.size = function() {
        this.getCookieValues();
        var count = 0;
        for (i = 0; i < this.qtyArray.length; i++) {
            count += parseInt(this.qtyArray[i], 10);
        }
        return count;
    }

    this.getCartArray = function() {
        this.getCookieValues();
        var returnArray = new Array();
        for (i = 0; i < this.skuArray.length; i++) {
            returnArray[i] = new Array();
            returnArray[i].push(this.skuArray[i]);
            returnArray[i].push(this.qtyArray[i]);
        }
        return returnArray;
    }
}
