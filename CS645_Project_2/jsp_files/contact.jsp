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
        <title>Contact</title>

        <link rel="stylesheet" href="/jadrn025/css/menu.css">
        <link rel="stylesheet" href="/jadrn025/css/contact.css">
        <link rel="stylesheet" href="/jadrn025/css/footer.css">

        <script type="text/javascript" src="http://jadran.sdsu.edu/jquery/jquery.js"></script>
        <script type="text/javascript" src="/jadrn025/js/shopping_cart.js"></script>
        <script type="text/javascript" src="/jadrn025/js/menu_search.js"></script>
        <script type="text/javascript" src="/jadrn025/js/contact.js"></script>
    </head>
    <body>
        <%-- MENU --%>
        <%@ include file="menu.jsp" %>

        <div id="content">
            <div>
                <p>Customer</p>
                <p>Service</p>
            </div>

            <div>
                <div>
                    <p>Contact Us</p>
                    <p>If you have any inquiries or if there are any problems with your order such as with the status of the shipment or the details of our returns policy, please feel free to contact us. Our employees are ready to fulfill your requests to the best of their abilities during our service hours.</p>
                </div>
                <div>
                    <p>Customer Service Hours</p>
                    <br>
                    <p>Monday - Friday: 9:00am - 7:00pm</p>
                    <p>Saturday - Sunday: 11:00am - 7:00pm</p>
                    <br>
                    <p>Phone: (812) 695-0912</p>
                    <p>Email: customerservice@packback.com</p>
                </div>
            </div>
        </div>

        <%-- FOOTER --%>
        <%@ include file="footer.jsp" %>
    </body>
</html>
