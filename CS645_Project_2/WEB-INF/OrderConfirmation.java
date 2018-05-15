/*
* Nguyen, Thuc
* jadrn025
* Project #2
* Spring 2018
*/

import java.io.*;
import java.text.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;

/*
* Servlet that takes the parameters in the form and displays it in a confirmation page.
* The following are shown by storing the values in a String array and passing it to
* OrderConfirmation.jsp -
* 1) Future date (2 weeks from today)
* 2) Shipping Address
* 3) Payment type
* 4) Billing Address
*
* The order table and order summary are generated here, represented as an HTML string,
* and are also sent to the jsp in the String array.
*/

public class OrderConfirmation extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException {

        response.setContentType("text/html");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        // Get the cookies sent and stored in request object
        Cookie cookie = null;
        Cookie[] listOfCookies = null;

        listOfCookies = request.getCookies();
        if (listOfCookies == null) {
            out.print("<html><head></head><body><h1>Error</h1></body></html>");
            return;
        }

        // Iterate over the cookies to find one with the key jadrn025
        for (int i = 0; i < listOfCookies.length; i++) {
            if (listOfCookies[i].getName().equals("jadrn025")) {
                cookie = listOfCookies[i];
            }
        }

        // Return error if cookie doesn't exist
        if (cookie == null) {
            out.print("<html><head></head><body><h1>Error</h1></body></html>");
            return;
        }

        // Retrieve the value of the cookie, and split the value to get a list of
        // "sku|quantity" pairs
        String cookieValue = cookie.getValue();
        String[] skuQuantityPairs = cookieValue.split("\\|\\|");

        Vector<String[]> productDetailsVector = null;
        // More than 1 pair ( sku|quantity||sku|quantity )
        if (skuQuantityPairs.length > 1) {

            StringBuffer buffer = new StringBuffer("SELECT sku, manufacturerID, vendor.name, category.name, description, features, retail, quantity, image FROM product, vendor, category WHERE product.venID = vendor.id AND product.catID = category.id AND (");

            // Iterate over the list of pairs, get the sku of each pair, and
            // build the query
            for (int i = 0; i < skuQuantityPairs.length; i++) {
                String[] skuQuantityPair = skuQuantityPairs[i].split("\\|");
                buffer.append(" sku='" + skuQuantityPair[0] + "' OR");
            }
            buffer.delete(buffer.length() - 3, buffer.length());
            buffer.append(");");

            // Perform query and return result
            productDetailsVector = DBHelper.runQuery(buffer.toString());
        }
        // Only 1 pair ( sku|quantity )
        else {

            // Split the single sku-quantity pair to get the sku
            String[] skuQuantityPair = cookieValue.split("\\|");

            String query = "SELECT sku, manufacturerID, vendor.name, category.name, description, features, retail, quantity, image FROM product, vendor, category WHERE product.venID = vendor.id AND product.catID = category.id AND sku='" + skuQuantityPair[0] + "';";

            // Perform query and return result
            productDetailsVector = DBHelper.runQuery(query);
        }

        if (productDetailsVector == null) {
            out.print("<html><head></head><body><h1>Error</h1></body></html>");
            return;
        }

        // Call methods that return appropriate strings to populate jsp file
        String estimatedDelivery = buildEstimatedDelivery();
        String shippingAddress = buildShippingAddress(request);
        String payment = buildPayment(request);
        String billingAddress = buildBillingAddress(request);
        String checkoutTable = buildCheckoutTable(request, productDetailsVector, skuQuantityPairs);
        String orderSummary = buildOrderSummary(request, productDetailsVector, skuQuantityPairs);

        String[] confirmationDetails = {estimatedDelivery, shippingAddress, payment, billingAddress,
                                        checkoutTable, orderSummary};

        request.setAttribute("confirmationDetails", confirmationDetails);
        RequestDispatcher dispatcher = request.getRequestDispatcher("/WEB-INF/jsp/OrderConfirmation.jsp");
        dispatcher.forward(request, response);
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException {

        doGet(request, response);
    }

    /*
    * Get future date from the current date
    */
    private String buildEstimatedDelivery() {
        // Get instance of Calendar, add 2 weeks to the current date
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, 14);
        String futureDate = "<p>" + calendar.get(Calendar.MONTH) + "/" +
            calendar.get(Calendar.DAY_OF_MONTH) + "/" + calendar.get(Calendar.YEAR) + "</p>";

        return futureDate;
    }

    /*
    * Build html string for the shipping address if it is available, else inform
    * that shipping address was the same as billing address
    */
    private String buildShippingAddress(HttpServletRequest request) {
        if (request.getParameter("shippingCheckbox") != null) {
            return "<p>Same as billing address</p>";
        }

        if (request.getParameter("shipFirstName") == null || request.getParameter("shipLastName") == null ||
            request.getParameter("shipAddress") == null || request.getParameter("shipCity") == null ||
            request.getParameter("shipState") == null || request.getParameter("shipZipCode") == null ||
            request.getParameter("shipPhoneArea") == null || request.getParameter("shipPhone3") == null ||
            request.getParameter("shipPhone4") == null) {

            return "";
        }

        StringBuffer buffer = new StringBuffer("<p>");
        buffer.append(request.getParameter("shipFirstName") + " " + request.getParameter("shipLastName") +
        "</p><p>" + request.getParameter("shipAddress") + "</p><p>" + request.getParameter("shipCity") +
        ", " + request.getParameter("shipState") + " " + request.getParameter("shipZipCode") + "</p>" +
        "<p>Phone: (" + request.getParameter("shipPhoneArea") + ") " + request.getParameter("shipPhone3") +
        "-" + request.getParameter("shipPhone4") + "</p>");

        return buffer.toString();
    }

    /*
    * Build html string for payment type and card number. Chop off first 12 digits
    * of the card number and only reveal last 4 digits.
    */
    private String buildPayment(HttpServletRequest request) {
        if (request.getParameter("radioPaymentType") == null || request.getParameter("cardNumber") == null) {
            return "";
        }

        String paymentType = request.getParameter("radioPaymentType");
        String cardNumber = request.getParameter("cardNumber");
        cardNumber = cardNumber.substring(12, 16);

        return "<p>" + paymentType + " ending in " + cardNumber + "</p>";
    }

    /*
    * Build html string for billing address
    */
    private String buildBillingAddress(HttpServletRequest request) {
        if (request.getParameter("billFirstName") == null || request.getParameter("billLastName") == null ||
            request.getParameter("billAddress") == null || request.getParameter("billCity") == null ||
            request.getParameter("billState") == null || request.getParameter("billZipCode") == null ||
            request.getParameter("billPhoneArea") == null || request.getParameter("billPhone3") == null ||
            request.getParameter("billPhone4") == null) {

            return "";
        }

        StringBuffer buffer = new StringBuffer("<p>");
        buffer.append(request.getParameter("billFirstName") + " " + request.getParameter("billLastName") + "</p><p>" + request.getParameter("billAddress") + "</p><p>" + request.getParameter("billCity") +
        ", " + request.getParameter("billState") + " " + request.getParameter("billZipCode") + "</p>");
        buffer.append("<p>Phone: (" + request.getParameter("billPhoneArea") + ") " +
        request.getParameter("billPhone3") + "-" + request.getParameter("billPhone4") + "</p>");

        return buffer.toString();
    }

    /*
    * Build html string for the table
    * From productDetailsVector - Product, Description
    * From skuQuantityPairs - Quantity, Price (retail from product vector)
    */
    private String buildCheckoutTable(HttpServletRequest request, Vector<String[]> productDetailsVector,
                                    String[] skuQuantityPairs) {
        StringBuffer buffer = new StringBuffer("<table><tr><th>Product</th><th>Description</th><th>Quantity</th><th>Price</th></tr>");

        for (int i = 0; i < productDetailsVector.size(); i++) {

            String[] product = productDetailsVector.get(i);
            String[] splitPair = skuQuantityPairs[i].split("\\|");

            double retail = Double.parseDouble(product[6]);
            int quantity = Integer.parseInt(splitPair[1]);
            double price = retail * quantity;

            buffer.append("<tr id=\"" + product[0] + "\"><td><img src=\"/~jadrn025/proj1/product_images/" + 
                        product[8] + "\" alt=\"" + product[2] + " " + product[1] + "\"></td><td><p>" +
                        product[2] + " " + product[1] + "</p>" + product[4] + "</td><td><b>" +
                        (String.valueOf(quantity)) + "</b></td><td><b>$" + (String.format("%.2f", price)) + "</b></td></tr>");
        }
        buffer.append("</table>");

        return buffer.toString();
    }

    /*
    * Build html string for the order summary
    * From productDetailsVector - getting retail price
    * From skuQuantityPairs - cart size, quantity, price
    */
    private String buildOrderSummary(HttpServletRequest request, Vector<String[]> productDetailsVector,
                                    String[] skuQuantityPairs) {

        // Find cart size by iterating through pairs taken from cookie and adding the quantity together
        int cartSize = 0;
        for (String pair : skuQuantityPairs) {
            String[] splitPair = pair.split("\\|");
            cartSize += Integer.valueOf(splitPair[1]);
        }

        // Find subtotal by iterating through productDetailsVector
        double subTotal = 0;
        for (int i = 0; i < productDetailsVector.size(); i++) {

            String[] product = productDetailsVector.get(i);
            String[] splitPair = skuQuantityPairs[i].split("\\|");

            double retail = Double.parseDouble(product[6]);
            int quantity = Integer.parseInt(splitPair[1]);
            double price = retail * quantity;
            subTotal += price;
        }

        double taxMultiplier = 0.0775;
        double flatShippingFee = 5.00;

        double shippingTotal = flatShippingFee * cartSize;
        double taxTotal = taxMultiplier * (subTotal + shippingTotal);
        double total = subTotal + shippingTotal + taxTotal;

        // Set up the Strings for the order summary
        String subtotalString = String.format("%.2f", subTotal);
        String shippingTotalString = String.format("%.2f", shippingTotal);
        String taxTotalString = String.format("%.2f", taxTotal);
        String totalString = String.format("%.2f", total);

        StringBuffer buffer = new StringBuffer("<table><tr><td>Subtotal</td><td>$" + subtotalString +
                            "</td></tr><tr><td>Shipping<p>*Flat rate ($5.00)</p></td><td>$" +
                            shippingTotalString + "</td></tr><tr><td>Tax</td><td>$" + taxTotalString +
                            "</td></tr><tr><td>Total</td><td>$" + totalString + "</td></tr></table>");

        return buffer.toString();
    }

}
