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
* Called from browse.js when the user wants to filter the database given the options he/she
* checked off. Builds the query for the database and returns the details of the products
* that meet the filter criteria.
*/
public class ProductsFilter extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException {

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        String query = buildQuery(request);
        String result = DBHelper.doQuery(query);
        out.print(result);
    }

    /* Build the query to be executed. This function builds the sql statement using
    * 'AND' for each filter category and OR for multiple checks within a filter category.
    * For example, 'AND' would be used if user filters based on vendor and category, and
    * 'OR' if user checked off 'Adidas' and 'Herschel' for vendor.
    */
    private String buildQuery(HttpServletRequest request) {
        boolean categoryValueExists = false;
        boolean vendorValueExists = false;
        Enumeration<String> keys = request.getParameterNames();
        StringBuffer buffer = new StringBuffer("SELECT sku, manufacturerID, vendor.name, category.name, description, retail, quantity, image FROM product, vendor, category WHERE product.venID = vendor.id AND product.catID = category.id");

        if (request.getParameterValues("category") != null && request.getParameterValues("category").length > 0) {
            categoryValueExists = true;
        }
        if (request.getParameterValues("vendor") != null && request.getParameterValues("vendor").length > 0) {
            vendorValueExists = true;
        }

        while (keys.hasMoreElements()) {
            String parameter = keys.nextElement();
            switch (parameter) {
                case "category":
                    // Break if no values associated with parameter
                    if (!categoryValueExists) {
                        break;
                    }
                    buffer.append(" AND (");
                    for (String value : request.getParameterValues("category")) {
                        buffer.append(" category.name='" + value + "' OR");
                    }

                    // Delete the " OR" at the end and close out the parentheses
                    buffer.delete(buffer.length() - 3, buffer.length());
                    buffer.append(")");
                    break;

                case "vendor":
                    // Break if no values associated with parameter
                    if (!vendorValueExists) {
                        break;
                    }
                    buffer.append(" AND (");
                    for (String value : request.getParameterValues("vendor")) {
                        buffer.append(" vendor.name='" + value + "' OR");
                    }

                    // Delete the " OR" at the end and close out the parentheses
                    buffer.delete(buffer.length() - 3, buffer.length());
                    buffer.append(")");
                    break;

                case "price":
                    // Break if null or no values associated with parameter
                    if (request.getParameterValues("price") == null) {
                        break;
                    }
                    if ( !(request.getParameterValues("price").length > 0) ) {
                        break;
                    }
                    buffer.append(" AND (");
                    for (String value : request.getParameterValues("price")) {
                        if (value.equals("0-25")) {
                            buffer.append(" retail BETWEEN 0 AND 25 OR");
                        }
                        else if (value.equals("25-50")) {
                            buffer.append(" retail BETWEEN 25 AND 50 OR");
                        }
                        else if (value.equals("50-100")) {
                            buffer.append(" retail BETWEEN 50 AND 100 OR");
                        }
                        else if (value.equals("100+")) {
                            buffer.append(" retail >= 100 OR");
                        }
                    }

                    // Delete the " OR" at the end and close out the parentheses
                    buffer.delete(buffer.length() - 3, buffer.length());
                    buffer.append(")");
                    break;

                case "availability":
                    // Break if null or no values associated with parameter
                    if (request.getParameterValues("availability") == null) {
                        break;
                    }
                    if (! (request.getParameterValues("availability").length > 0) ) {
                        break;
                    }

                    buffer.append(" AND (");
                    for (String value : request.getParameterValues("availability")) {
                        if (value.equals("instock")) {
                            buffer.append(" quantity > 0 OR");
                        }
                        else if (value.equals("comingsoon")) {
                            buffer.append(" quantity = 0 OR");
                        }
                    }
                    // Delete the " OR" at the end and close out the parentheses
                    buffer.delete(buffer.length() - 3, buffer.length());
                    buffer.append(")");

                    break;
                default:
                    break;
            }
        }
        buffer.append(";");
        return buffer.toString();
    }
}
