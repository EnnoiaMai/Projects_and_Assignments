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
* Servlet that queries database for random products in which the quantity is greater than
* zero. Four items will be returned to the home screen along with the vendor, manufacturerID,
* and description of the product. Uses a random number generator.
*/
public class TrendingProducts extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException {

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        // Query to return information about specific sku
        String query = "SELECT sku, manufacturerID, vendor.name, description, image FROM product, vendor WHERE product.venID = vendor.id AND (quantity > 0);";

        Vector<String[]> productDetailsVector = DBHelper.runQuery(query);
        if (productDetailsVector == null) {
            out.print("error");
            return;
        }

        // Shuffle the collection and return the first 4 records
        Collections.shuffle(productDetailsVector);

        StringBuffer buffer = new StringBuffer();
        for (int i = 0; i < 4; i++) {
            String[] product = productDetailsVector.get(i);

            for (int p = 0; p < product.length; p++) {
                String field = product[p];
                buffer.append(field);

                if (p < (product.length - 1)) {
                    buffer.append("|");
                }
            }
            if (i < 3) {
                buffer.append("||");
            }
        }

        out.print(buffer.toString());
    }
}
