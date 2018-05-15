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
* Servlet expected to be called on using AJAX from OrderConfirmation.jsp.
* GET - takes from the cookie passed in multiple sku and quantity values, checks
*       against database to see if each sku's quantity is valid, then adds it to an
*       ArrayList of skus to be marked as invalid. Serializes skus into a String and
*       send it back.
*       However, entire process is synchronized, from comparing quantities of the cookie
*       and quantities in the database, to subtracting amount from the database.
*/
public class PlaceOrder extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException {

        placeOrderAndChangeQuantity(request, response);
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException {

        doGet(request, response);
    }

    public synchronized void placeOrderAndChangeQuantity(HttpServletRequest request,
        HttpServletResponse response) throws IOException, ServletException {

        response.setContentType("text/html");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        // Get the cookies sent and stored in request object
        Cookie cookie = null;
        Cookie[] listOfCookies = null;

        listOfCookies = request.getCookies();
        if (listOfCookies == null) {
            out.print("error - no cookies");
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
            out.print("error - no cookie jadrn025");
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
            out.print("error - query failed");
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

        // If nothing invalid, or nothing in list, go ahead and subtract quantity from database.
        // Otherwise, serialize the string of invalid skus to send back.
        if (listOfInvalidSkus.size() == 0) {
            String answer = "";
            for (String[] product : productDetailsVector) {
                for (String pair : skuQuantityPairs) {
                    String[] splitPair = pair.split("\\|");
                    if (splitPair[0].equals(product[0])) {
                        int newQuantity = Integer.parseInt(product[1]) - Integer.parseInt(splitPair[1]);
                        String query = "UPDATE product SET quantity=" + String.valueOf(newQuantity) +
                        " WHERE sku='" + product[0] + "';";
                        answer = DBHelper.runUpdate(query);
                    }
                }
            }

            out.print(answer);
        }
        else {
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
}
