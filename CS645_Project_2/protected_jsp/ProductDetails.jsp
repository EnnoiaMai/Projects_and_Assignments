<!DOCTYPE html>
<!--
Nguyen, Thuc
jadrn025
Project #2
Spring 2018
-->

<%
    String[] detailsArray = (String[]) request.getAttribute("product");
    String availabilityStatus = "";
    String statusClass = "";
    if (Integer.parseInt(detailsArray[7]) > 0) {
        availabilityStatus = "In Stock";
        statusClass = "in_stock";
    } else {
        availabilityStatus = "Coming Soon";
        statusClass = "coming_soon";
    }
%>

<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <title>Order</title>

        <link rel="stylesheet" href="/jadrn025/css/menu.css">
        <link rel="stylesheet" href="/jadrn025/css/product_details.css">
        <link rel="stylesheet" href="/jadrn025/css/footer.css">

        <script type="text/javascript" src="http://jadran.sdsu.edu/jquery/jquery.js"></script>
        <script type="text/javascript" src="/jadrn025/js/shopping_cart.js"></script>
        <script type="text/javascript" src="/jadrn025/js/menu_search.js"></script>
        <script type="text/javascript" src="/jadrn025/js/product_details.js"></script>
    </head>
    <body>
        <%-- MENU --%>
        <jsp:include page="/jsp_files/menu.jsp"/>

        <div id="content">
            <div id="confirmation_container">
                <div>
                    <img src="" alt="Status: ">
                </div>
                <p>The item was successfully added to your cart!</p>
            </div>
            <div id="product_container">
                <div id="image_preview">
                    <img src="/~jadrn025/proj1/product_images/<% out.println(detailsArray[8]);%>" alt="">
                </div>
                <div id="details_container">
                    <p>
                        <%
                            out.print(detailsArray[2] + " ");
                            out.println(detailsArray[1]);
                        %>
                    </p>
                    <div>
                        <div>
                            <p class="<% out.print(statusClass); %>"><% out.println(availabilityStatus); %></p>
                            <p><span id="quantity"><% out.println(detailsArray[7]); %></span> left</p>
                        </div>
                        <p>$<% out.println(detailsArray[6]); %></p>
                    </div>
                    <p>Description:</p>
                    <p><% out.println(detailsArray[4]); %></p>
                    <p>Features:</p>
                    <p><% out.println(detailsArray[5]); %></p>
                    <div>
                        <div>
                            <label for="">Qty</label>
                            <input type="text" name="" value="" size="4" maxlength="3">
                        </div>
                        <button type="button" id="<% out.print(detailsArray[0]); %>">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>

        <%-- FOOTER --%>
        <jsp:include page="/jsp_files/footer.jsp"/>

    </body>
</html>
