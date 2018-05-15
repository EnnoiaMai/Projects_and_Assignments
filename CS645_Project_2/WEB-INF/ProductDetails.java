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
* Servlet that queries database for information about the specific sku and forwards result to
* ProductDetails.jsp to display the information.
*/
public class ProductDetails extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException {

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        if (request.getParameter("sku") == null) {
            out.print("<html><head></head><body><h1>Error</h1></body></html>");
            return;
        }

        // Query to return information about specific sku
        String query = "SELECT sku, manufacturerID, vendor.name, category.name, description, features, retail, quantity, image FROM product, vendor, category WHERE product.venID = vendor.id AND product.catID = category.id AND sku='" + request.getParameter("sku") + "';";

        Vector<String[]> productDetailsVector = DBHelper.runQuery(query);
        if (productDetailsVector == null) {
            out.print("<html><head></head><body><h1>Error</h1></body></html>");
            return;
        }

        // Expect to get only 1 record because each sku is unique
        String[] productDetails = productDetailsVector.get(0);

        request.setAttribute("product", productDetails);
        RequestDispatcher dispatcher = request.getRequestDispatcher("/WEB-INF/jsp/ProductDetails.jsp");
        dispatcher.forward(request, response);
    }

}
