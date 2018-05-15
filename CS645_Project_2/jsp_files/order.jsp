<!DOCTYPE html>
<!--
Nguyen, Thuc
jadrn025
Project #2
Spring 2018
-->
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <title>Order</title>

        <link rel="stylesheet" href="/jadrn025/css/menu.css">
        <link rel="stylesheet" href="/jadrn025/css/order.css">
        <link rel="stylesheet" href="/jadrn025/css/footer.css">

        <script type="text/javascript" src="http://jadran.sdsu.edu/jquery/jquery.js"></script>
        <script type="text/javascript" src="/jadrn025/js/shopping_cart.js"></script>
        <script type="text/javascript" src="/jadrn025/js/menu_search.js"></script>
        <script type="text/javascript" src="/jadrn025/js/order.js"></script>
    </head>
    <body>
        <%-- MENU --%>
        <%@ include file="menu.jsp" %>

        <div id="confirmation_container">
            <div>
                <img src="" alt="Status: ">
            </div>
            <p></p>
        </div>

        <div id="content">
            <!-- SHOPPING CART -->
            <div>
                <h2>Your Cart</h2>
                <div id="order_table_div">
                </div>
            </div>
            <div id="order_summary">
                <h2>Order Summary</h2>
                <div id="order_summary_div">
                </div>
                <button type="button" name="checkoutButton">Check Out Now</button>
            </div>
        </div>

        <%-- FOOTER --%>
        <%@ include file="footer.jsp" %>
    </body>
</html>
