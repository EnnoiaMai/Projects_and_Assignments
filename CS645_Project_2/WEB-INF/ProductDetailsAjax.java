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
* Servlet that takes the (sku|quantity) pair(s) from the value of the cookie
* and uses the sku(s) as part of the query to the database. Returns details about
* the products the user ordered in a serialized string.
*/
public class ProductDetailsAjax extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException {

        response.setContentType("text/html");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        Cookie cookie = null;
        Cookie[] listOfCookies = null;

        // Get the cookies sent and stored in request object
        listOfCookies = request.getCookies();

        if (listOfCookies == null) {
            out.print("error all cookies");
            return;
        }

        // Iterate over the cookies to find one with key jadrn025
        for (int i = 0; i < listOfCookies.length; i++) {
            if (listOfCookies[i].getName().equals("jadrn025")) {
                cookie = listOfCookies[i];
            }
        }

        // Return error if cookie doesn't exist
        if (cookie == null) {
            out.print("error cookie");
            return;
        }

        // Retrieve the value of the cookie
        String cookieValue = cookie.getValue();

        // Split the value to get a list of "sku|quantity" pairs
        String[] skuQuantityPairs = cookieValue.split("\\|\\|");

        if (skuQuantityPairs.length > 1) {
            // Iterate over the list of pairs, get the sku of each pair, and
            // build the query
            StringBuffer buffer = new StringBuffer("SELECT sku, manufacturerID, vendor.name, category.name, description, features, retail, quantity, image FROM product, vendor, category WHERE product.venID = vendor.id AND product.catID = category.id AND (");
            for (int i = 0; i < skuQuantityPairs.length; i++) {
                String[] skuQuantityPair = skuQuantityPairs[i].split("\\|");
                buffer.append(" sku='" + skuQuantityPair[0] + "' OR");
            }
            buffer.delete(buffer.length() - 3, buffer.length());
            buffer.append(");");

            // Perform query and return result
            String result = DBHelper.doQuery(buffer.toString());
            out.print(result);
        } else {
            String[] skuQuantityPair = cookieValue.split("\\|");
            String query = "SELECT sku, manufacturerID, vendor.name, category.name, description, features, retail, quantity, image FROM product, vendor, category WHERE product.venID = vendor.id AND product.catID = category.id AND sku='" + skuQuantityPair[0] + "';";

            // Perform query and return result
            String result = DBHelper.doQuery(query);
            out.print(result);
        }
    }

}
