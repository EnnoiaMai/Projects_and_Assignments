<!DOCTYPE html>
<!--
Nguyen, Thuc
jadrn025
Project #2
Spring 2018
-->

<%
    // Get the value from attribute key "confirmationDetails"
    String[] confirmationDetails = (String[]) request.getAttribute("confirmationDetails");
%>

<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>

        <link rel="stylesheet" href="/jadrn025/css/menu.css">
        <link rel="stylesheet" href="/jadrn025/css/orderconfirmation.css">
        <link rel="stylesheet" href="/jadrn025/css/footer.css">

        <script type="text/javascript" src="http://jadran.sdsu.edu/jquery/jquery.js"></script>
        <script type="text/javascript" src="/jadrn025/js/shopping_cart.js"></script>
        <script type="text/javascript" src="/jadrn025/js/menu_search.js"></script>
        <script type="text/javascript" src="/jadrn025/js/orderconfirmation.js"></script>
    </head>

    <body>
        <%-- MENU --%>
        <jsp:include page="/jsp_files/menu.jsp"/>

        <div id="confirmation_container">
            <div>
                <img src="" alt="Status: ">
            </div>
            <p></p>
        </div>

        <div id="content">
            <div>
                <h2>Review Your Order</h2>
                <p>Please review and confirm that the following information is correct.</p>

                <div id="delivery_div">
                    <div>
                        <div>
                            <h4>Estimated Delivery</h4>
                            <% out.print(confirmationDetails[0]); %>
                        </div>
                        <div>
                            <h4>Shipping Address</h4>
                            <% out.print(confirmationDetails[1]); %>
                        </div>
                    </div>
                    <div>
                        <div>
                            <h4>Payment</h4>
                            <% out.print(confirmationDetails[2]); %>
                        </div>
                        <div>
                            <h4>Billing Address</h4>
                            <% out.print(confirmationDetails[3]); %>
                        </div>
                    </div>
                </div>

                <div id="checkout_table_div">
                    <% out.print(confirmationDetails[4]); %>
                </div>
            </div>

            <div id="order_summary">
                <h2>Order Summary</h2>
                <div id="checkout_order_div">
                    <% out.print(confirmationDetails[5]); %>
                </div>
                <button type="button" name="placeOrderButton">Place your order</button>
            </div>
        </div>

        <%-- FOOTER --%>
        <jsp:include page="/jsp_files/footer.jsp"/>

    </body>
</html>
