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
* Called from menu_search.js when the user enters a search term from the menu.
* After running the query in DBHelper class, and getting the results back, the
* HTML string is set as the value of the attribute "searchResults" and dispatched
* to search_products.jsp where the products are displayed in a grid.
*/
public class SearchProducts extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException {

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        String searchResults = buildResults(request);

        request.setAttribute("searchResults", searchResults);
        RequestDispatcher dispatcher = request.getRequestDispatcher("/jsp_files/search_products.jsp");
        dispatcher.forward(request, response);
    }

    /* Sends the search term as argument to DBHelper.runSearch()
    * Builds the HTML string in which each product will be contained in a grid item.
    */
    public String buildResults(HttpServletRequest request) {

        if (request.getParameter("search") == null) {
            return "";
        }
        String searchTerm = request.getParameter("search");

        Vector<String[]> listOfProducts = DBHelper.runSearch(searchTerm);

        StringBuffer gridString = new StringBuffer();
        for (int i = 0; i < listOfProducts.size(); i++) {
            String[] product = listOfProducts.get(i);
            String description = product[4];

            if (description.length() > 60) {
                description = description.substring(0, 60);
            }
            description += "...";

            String status = "";
            String statusClass = "";
            if (Integer.parseInt(product[6]) > 0) {
                status = "In Stock";
                statusClass = "in_stock";
            } else {
                status = "Coming Soon";
                statusClass = "coming_soon";
            }

            gridString.append("<div class=\"product_box\"><div class=\"product_image\">" +
            "<img src=\"/~jadrn025/proj1/product_images/" + product[7] + "\" alt=\"" +
            product[2] + " " + product[1] + "\"></div><p>" + product[2] + " " + product[1] + "</p><p>" +
            description + "</p><div class=\"product_status_price\"><div><p class=\"" + statusClass  +
            "\">" + status + "</p><p>" + product[6] + " left</p></div><p>$" + product[5] +
            "</p></div><button type=\"button\" id=\"" + product[0] + "\">Add to Cart</button></div>");
        }

        return gridString.toString();
    }
}
