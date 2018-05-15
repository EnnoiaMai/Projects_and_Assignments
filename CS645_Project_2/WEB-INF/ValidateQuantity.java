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
* Servlet expected to be called on using AJAX on client side. (From ProductDetails.jsp and order.jsp)
* GET - takes in single sku and quantity value, checks against the database to see
*       if the quantity is valid, allowing user to add sku to cart or inform user to
*       remove sku from cart.
*
* POST - takes from the cookie passed in multiple sku and quantity values, checks
*       against database to see if each sku's quantity is valid, then adds it to an
*       ArrayList of skus to be marked as invalid. Serializes skus into a String and
*       send it back.
*/
public class ValidateQuantity extends HttpServlet {

    /*
    * Called from ProductDetails.jsp to check if the current sku quantity amount is
    * valid. Returns -
    * 1) error - if error occurred
    * 2) valid - if amount isn't available for quantity
    * 3) invalid - if amount is available for quantity
    */
    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException {

        response.setContentType("text/html");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        if (request.getParameter("sku") == null || request.getParameter("quantity") == null) {
            out.print("error - null parameter");
            return;
        }

        // Query to get quantity from specific sku
        String query = "SELECT sku, quantity FROM product WHERE sku='" + request.getParameter("sku") + "';";

        Vector<String[]> productQuantityVector = DBHelper.runQuery(query);
        if (productQuantityVector == null) {
            out.print("error - null query response");
            return;
        }

        String[] productQuantity = productQuantityVector.get(0);

        if (Integer.parseInt(productQuantity[1]) - Integer.parseInt(request.getParameter("quantity")) < 0) {
            out.print("invalid");
        } else {
            out.print("valid");
        }
    }

    /*
    * Returns a list of skus that are invalid and should be removed from cart because
    * the amount for that quantity in the database isn't available.
    */
    public void doPost(HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException {

        response.setContentType("text/html");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        // Get the cookies sent and stored in request object
        Cookie cookie = null;
        Cookie[] listOfCookies = null;

        listOfCookies = request.getCookies();
        if (listOfCookies == null) {
            out.print("error");
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
            out.print("error");
            return;
        }

        // Retrieve the value of the cookie, and split the value to get a list of
        // "sku|quantity" pairs
        String cookieValue = cookie.getValue();
        String[] skuQuantityPairs = cookieValue.split("\\|\\|");

        Vector<String[]> productDetailsVector = null;
        // More than 1 pair ( sku|quantity||sku|quantity )
        if (skuQuantityPairs.length > 1) {

            StringBuffer buffer = new StringBuffer("SELECT sku, quantity FROM product WHERE (");

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

            String query = "SELECT sku, quantity FROM product WHERE sku='" + skuQuantityPair[0] + "';";

            // Perform query and return result
            productDetailsVector = DBHelper.runQuery(query);
        }

        if (productDetailsVector == null) {
            out.print("error");
            return;
        }

        // List of skus that are marked as invalid
        ArrayList<String> listOfInvalidSkus = new ArrayList<>(skuQuantityPairs.length);
        // For each record returned from query...
        for (String[] product : productDetailsVector) {

            // For each sku|quantity pair from the cookie
            for (String pair : skuQuantityPairs) {

                // Split pair and check that sku from cookie and from query is samw
                String[] splitPair = pair.split("\\|");
                if (splitPair[0].equals(product[0])) {

                    // If quantity from database subtracted to quantity from cookie is less than
                    // 0, then add to invalid list
                    if (Integer.parseInt(product[1]) - Integer.parseInt(splitPair[1]) < 0) {
                        listOfInvalidSkus.add(splitPair[0]);
                    }
                }
            }
        }

        // Serialize the String to send back
        StringBuffer skuBuffer = new StringBuffer();
        for (String sku : listOfInvalidSkus) {
            skuBuffer.append(sku + "|");
        }
        if (skuBuffer.length() > 0) {
            skuBuffer.delete(skuBuffer.length() - 1, skuBuffer.length());
        }
        out.print(skuBuffer.toString());
    }
}
